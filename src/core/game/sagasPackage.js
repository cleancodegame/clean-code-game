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
      const finishedPackages = {
        initial: true,
      }
      const allFinished = snap.val() || {}

      Object.keys(allFinished).forEach(id =>
        finishedPackages[allFinished[id].packageId] = allFinished[id]
      )

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
      : []

    if (!finishedPackages) {
      finishedPackages = []
    }

    if (packages) {
      yield put(actions.setPackages({ packages, finishedPackages }))
      yield put(actions.successGetPackages())
    }
  }
}

function setPackageScore(uid, packageId, userName, score, maxScore, time) {
  return firebase.database().ref('/perPackageScores')
    .orderByChild("uid").equalTo(uid)
    .once('value', snapshot => {
      let key
      let scoreData

      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val()

        if (childData.packageId === `${packageId}`) {
          key = childSnapshot.key
          scoreData = childData
        }
      })

      if (!key) {
        writeResultPackage(uid, packageId, userName, score, maxScore, time)

        return true
      }

      if (scoreData.score < score || (scoreData.score === score && scoreData.time > time)) {
        updateResultPackage(key, uid, userName, score, time)

        return true
      }
    })
}

function updateResultPackage(key, uid, userName, score, time) {
  firebase.database().ref(`perPackageScores/${key}`).update({
    score,
    time
  })
  .then(() => updateScore(uid, userName))
}

function writeResultPackage(uid, packageId, userName, score, maxScore, time) {
  firebase.database().ref('perPackageScores').push().set({
    packageId,
    userName,
    uid,
    score,
    maxScore,
    time,
  })
  .then(() => updateScore(uid, userName))
}

function updateScore(uid, userName) {
  firebase.database().ref('/perPackageScores').orderByChild("uid").equalTo(uid).once('value')
    .then(snapshot => {
      let score = 0
      let time = 0

      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val()

        score += childData.score
        time += childData.time
      })

      setNewScore(uid, userName, score, time)
    })
}

function setNewScore(uid, userName, score, time) {
  const fbScores = firebase.database().ref('/scores')

  fbScores.orderByChild("uid").equalTo(uid).once('value')
    .then(snapshot => {
      let key
      snapshot.forEach(childSnapshot => {
        key = childSnapshot.key
      })

      if (key) {
        firebase.database().ref(`scores/${key}`).update({
          score,
          time,
        })

        return
      }

      fbScores.push().set({
        userName,
        uid,
        score,
        time,
      })
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

    yield call(setPackageScore, uid, packageId, userName, totalScore, maxPossibleScore, packageTime)
  }
}


export default function* saga() {
  yield fork(handleStartPackage)
  yield fork(handleGetPackages)
  yield fork(handleWriteResultPackage)
}
