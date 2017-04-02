import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'
import { getCurentPackage } from '../reducers'

import {
  GET_PACKAGES,
  START_PACKAGE,
  AUTHORIZATION_FOR_CONTINUE_SUCCESS,
  FIND_BUG,
} from '../constants/server.js'
import { NEXT_LEVEL } from '../constants/game'

import {
  successGetLevels,
  getPackages,
  successGetPackages,
  startNextLevel,
  needAuthorizationForContinue,
  sendBugFix,
  sendStartLevel,
  sendFinishLevel,
  nextLevel,
} from '../actions/serverActions'

import {
  bugfix,
} from '../actions/gameActions'


function getLevels(packageId) {
  return firebase.database().ref('/levels').orderByChild("packageId").equalTo(Number(packageId)).once('value')
    .then(snap => {
      const returnedLevels = snap.val()

      return { levels: Object.keys(returnedLevels).map(id => { return {...returnedLevels[id], id } }) }
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
      yield put(nextLevel())
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
    yield take(GET_PACKAGES)

    const { packages } = yield call(getPackagesFromBase)

    const { uid } = yield select(state => state)

    let finishedPackages = uid
      ? yield call(getFinishedPackages, uid)
      : ['initial']

    if (!finishedPackages) {
      finishedPackages = ['initial']
    }

    if (packages) {
      yield put(successGetPackages({ packages, finishedPackages }))
    }
  }
}

function isFinishedPackage(state) {
  return state.levels.length - 1 <= state.currentLevelIndex
}

function writeResultPackage(id, uid, userName, score, maxScore) {
  firebase.database().ref('perPackageScores').push().set({
    packageId: id,
    userName,
    uid,
    score,
    maxScore,
  })
}

function* handleNextLevel() {
  while (true) {
    yield take(NEXT_LEVEL)

    const isFinished = yield select(isFinishedPackage)

    if (isFinished) {
      let { packageId, uid, userName, totalScore, maxPossibleScore} = yield select(state => state)

      if (uid) {
        yield call(writeResultPackage, packageId, uid, userName, totalScore, maxPossibleScore)
        yield put(getPackages())
      } else {
        yield put(needAuthorizationForContinue())
      }
    } else {
      yield put(startNextLevel())
      yield put(sendStartLevel())
    }
  }
}

function* handleFindBug() {
  while (true) {
    yield take(FIND_BUG)

    let { packageId, uid, userName, bugId, currentLevel} = yield select(state => state)

    yield put(bugfix(bugId))

    if (uid) {
      yield put(sendBugFix())

      if (currentLevel.bugsCount === 1) {
        yield put(sendFinishLevel())
      }
    }
  }
}


function* handleContinueAfterAuthorization() {
  while (true) {
    yield take(AUTHORIZATION_FOR_CONTINUE_SUCCESS)

    let { packageId, uid, userName, totalScore, maxPossibleScore} = yield select(state => state)

    yield call(writeResultPackage, packageId, uid, userName, totalScore, maxPossibleScore)
    yield put(getPackages())
  }
}

export default function* saga() {
  yield fork(handleStartPackage)
  yield fork(handleGetPackages)
  yield fork(handleNextLevel)
  yield fork(handleFindBug)
  yield fork(handleContinueAfterAuthorization)
}
