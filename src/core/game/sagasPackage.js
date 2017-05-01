import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as constants from './constants'
import * as actions from './actions'

function getPackageLevels(packageId) {
  return firebase.database().ref('/levels').orderByChild("packageId").equalTo(Number(packageId)).once('value')
    .then(snap => {
      const returnedLevels = snap.val()

      return { levels: Object.keys(returnedLevels).map(id => { return {...returnedLevels[id], id } }) }
    })
    .catch((e) => console.log(e))
}

function* handleStartPackage() {
  while (true) {
    yield take(constants.START_PACKAGE)

    const { packageId } = yield select(state => state.game)

    const { levels } = yield call(getPackageLevels, packageId)

    if (levels) {
      yield put(actions.setLevels({ levels }))

      yield put(actions.startNextLevel())
    }
  }
}

function getPackagesFromBase() {
  return firebase.database().ref('/packages').orderByChild("orderKey").once('value')
    .then(snap => {
      console.log(snap.val())
      return { packages: snap.val()}
    })
    .catch((e) => console.log(e))
}

function getFinishedPackages(uid) {
  return firebase.database().ref('/perPackageScores').orderByChild("uid").equalTo(uid).once('value')
    .then(snap => {
      const finishedPackages = ['initial']
      const allFinished = snap.val() || {}

      Object.keys(allFinished).forEach(id => {
        if (!finishedPackages.includes(allFinished[id].packageId)) {
          finishedPackages.push(allFinished[id].packageId)
        }
      })

      return finishedPackages
    })
    .catch((e) => console.log(e))
}

function* handleGetPackages() {
  while (true) {
    yield take(constants.GET_PACKAGES)

    const { packages } = yield call(getPackagesFromBase)
    const { uid } = yield select(state => state.auth)

    let finishedPackages = uid
      ? yield call(getFinishedPackages, uid)
      : ['initial']

    if (!finishedPackages) {
      finishedPackages = ['initial']
    }

    if (packages) {
      yield put(actions.setPackages({ packages, finishedPackages }))
      yield put(actions.successGetPackages())
    }
  }
}

function writeResultPackage(packageId, uid, userName, score, maxScore, time) {
  firebase.database().ref('perPackageScores').push().set({
    packageId,
    userName,
    uid,
    score,
    maxScore,
    time,
  })
}

function* handleWriteResultPackage() {
  while(true) {
    yield take(constants.WRITE_RESULT_PACKAGE)

    const { packageId, totalScore, maxPossibleScore, packageTime } = yield select(state => state.game)
    const { uid, userName } = yield select(state => state.auth)

    if (!uid) {
      return
    }
    
    yield call(writeResultPackage, packageId, uid, userName, totalScore, maxPossibleScore, packageTime)
  }
}


export default function* saga() {
  yield fork(handleStartPackage)
  yield fork(handleGetPackages)
  yield fork(handleWriteResultPackage)
}
