import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'
import { getCurentPackage } from '../reducers'

import {
  successGetLevels,
  getPackages,
  GET_PACKAGES, successGetPackages,
  START_PACKAGE,
  NEXT_LEVEL, startNextLevel,
  needAuthorizationForContinue,
  AUTHORIZATION_FOR_CONTINUE_SUCCESS,
} from '../actions'


function getLevels(packageId) {
  return firebase.database().ref('/levels').orderByChild("packageId").equalTo(Number(packageId)).once('value')
    .then(snap => {
      const returnedLevels = snap.val()

      return { levels: Object.keys(returnedLevels).map(key => returnedLevels[key]) }
    })
    .catch((e) => console.log(e))
}

function* handleStartPackage() {
  while (true) {
    yield take(START_PACKAGE)

    const packageId = yield select(getCurentPackage)

    const { levels } = yield call(getLevels, packageId)

    if (levels) {
      yield put(successGetLevels({ levels }))
    }
  }
}

function getPackagesFromBase() {
  return firebase.database().ref('/packages').orderByChild("orderKey").once('value')
    .then(snap => {
      return { packages: snap.val() }
    })
    .catch((e) => console.log(e))
}

function getFinishedPackages(userName) {
  return firebase.database().ref('/perPackageScores').orderByChild("userId").equalTo(userName).once('value')
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
    yield take(GET_PACKAGES)

    const { packages } = yield call(getPackagesFromBase)

    const { userName } = yield select(state => state)

    let finishedPackages = userName
      ? yield call(getFinishedPackages, userName)
      : ['initial']

    if (!finishedPackages) {
      finishedPackages = ['initial']
    }

    if (packages) {
      yield put(successGetPackages({ packages, finishedPackages }))
    }
  }
}

function isFinishedLevel(state) {
  return state.levels.length - 1 <= state.currentLevelIndex
}

function writeResultPackage(id, userName, score, maxScore) {
  firebase.database().ref('perPackageScores').push().set({
    packageId: id,
    userId: userName,
    score,
    maxScore,
  })
}

function* handleNextLevel() {
  while (true) {
    yield take(NEXT_LEVEL)

    const isFinished = yield select(isFinishedLevel)

    if (isFinished) {
      let { packageId, userName, totalScore, maxPossibleScore} = yield select(state => state)

      if (userName) {
        yield call(writeResultPackage, packageId, userName, totalScore, maxPossibleScore)
        yield put(getPackages())
      } else {
        yield put(needAuthorizationForContinue())
      }
    } else {
      yield put(startNextLevel())
    }
  }
}

function* handleContinueAfterAuthorization() {
  while (true) {
    yield take(AUTHORIZATION_FOR_CONTINUE_SUCCESS)

    let { packageId, userName, totalScore, maxPossibleScore} = yield select(state => state)

    yield call(writeResultPackage, packageId, userName, totalScore, maxPossibleScore)
    yield put(getPackages())
  }
}

export default function* saga() {
  yield fork(handleStartPackage)
  yield fork(handleGetPackages)
  yield fork(handleNextLevel)
  yield fork(handleContinueAfterAuthorization)
}
