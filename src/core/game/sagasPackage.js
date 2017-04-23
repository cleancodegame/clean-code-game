import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as constants from './constants'
import * as authConstants from '../auth/constants'
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
      yield put(actions.successGetLevels({ levels }))
      yield put(actions.nextLevel())
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

    const { uid } = yield select(state => state.game)

    let finishedPackages = uid
      ? yield call(getFinishedPackages, uid)
      : ['initial']

    if (!finishedPackages) {
      finishedPackages = ['initial']
    }

    if (packages) {
      yield put(actions.successGetPackages({ packages, finishedPackages }))
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

function* handleNextLevel() {
  while (true) {
    yield take(constants.NEXT_LEVEL)

    const isFinishedPackage = ({ game }) =>
      game.levels.length - 1 <= game.currentLevelIndex
    const isFinished = yield select(isFinishedPackage)

    if (isFinished) {
      yield put(actions.finishPackage())
    } else {
      yield put(actions.startNextLevel())
      yield put(actions.sendStartLevel())
    }
  }
}

function* handleFinishPackage() {
  while (true) {
    yield take(constants.FINISH_PACKAGE)

    const { packageId, uid, userName, totalScore, maxPossibleScore, packageTime } = yield select(state => state.game)

    if (uid) {
      yield call(writeResultPackage, packageId, uid, userName, totalScore, maxPossibleScore, packageTime)
      yield put(actions.goToPackagePage())
    } else {
      yield put(actions.goToAuthorizationPage())
      yield take(authConstants.SUCCESS_SIGN_IN)

      const { packageId, uid, userName, totalScore, maxPossibleScore, levels, currentLevelIndex } = yield select(state => state.game)
      const isFinishedPackage = levels.length - 1 <= currentLevelIndex

      if (isFinishedPackage) {
        yield call(writeResultPackage, packageId, uid, userName, totalScore, maxPossibleScore)
        yield put(actions.goToPackagePage())
      }
    }
  }
}

export default function* saga() {
  yield fork(handleStartPackage)
  yield fork(handleGetPackages)
  yield fork(handleNextLevel)
  yield fork(handleFinishPackage)
}
