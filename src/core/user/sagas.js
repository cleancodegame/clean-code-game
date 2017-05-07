import { fork, call, put, take, select } from 'redux-saga/effects'

import * as constants from './constants'
import { SUCCESS_SIGN_IN, INIT_SUCCESS_SIGN_IN } from '../auth/constants'
import { SUCCESS_GET_PACKAGES, SUCCESS_GET_LEVELS, START_NEXT_LEVEL } from '../game/constants'
import * as actions from './actions.js'
import { getPackages, sendStartLevel, writeResultPackage, startNextLevel } from '../game/actions'
import { requestSignIn, requestSignOut } from '../auth/actions'

function* handleContinueGameEvent() {
  while(true) {
    yield take(constants.CONTINUE_GAME_EVENT)

    yield put(requestSignIn())

    yield take(SUCCESS_SIGN_IN)
    yield put(actions.goToPackagePage())
  }
}

function* handleGoToPackagePage() {
  while(true) {
    yield take(constants.GO_TO_PACKAGE_PAGE)

    yield put(actions.toLoadPage())

    yield put(getPackages())

    yield take(SUCCESS_GET_PACKAGES)
    yield put(actions.toPackagePage())
  }
}

function* handleSingOutEvent() {
  while(true) {
    yield take(constants.SING_OUT_EVENT)

    yield put(requestSignOut())
    yield put(actions.toMainPage())
  }
}

function* handleInitSignIn() {
  while(true) {
    yield take(INIT_SUCCESS_SIGN_IN)

    yield put(actions.goToPackagePage())
  }
}

function* handleFinishPackageEvent() {
  while (true) {
    yield take(constants.FINISH_PACKAGE_EVENT)

    const { uid } = yield select(state => state.auth)

    if (uid) {
      yield put(writeResultPackage())
      yield put(actions.goToPackagePage())
    } else {
      yield put(actions.goToAuthorizationPage())
      yield take(SUCCESS_SIGN_IN)

      const { levels, currentLevelIndex } = yield select(state => state.game)
      const isFinishedPackage = levels.length - 1 <= currentLevelIndex

      if (isFinishedPackage) {
        yield put(writeResultPackage())
        yield put(actions.goToPackagePage())
      }
    }
  }
}


function* handleNextLevelEvent() {
  while (true) {
    yield take(constants.NEXT_LEVEL_EVENT)

    const isFinishedPackage = ({ game }) =>
      game.levels.length - 1 <= game.currentLevelIndex
    const isFinished = yield select(isFinishedPackage)

    if (isFinished) {
      yield put(actions.finishPackageEvent())
    } else {
      yield put(startNextLevel())
    }
  }
}

function* handleStartNextLevel() {
  while (true) {
    yield take(START_NEXT_LEVEL)
    yield put(sendStartLevel())

    yield put(actions.toPlayPage())
  }
}


export default function* saga() {
  yield fork(handleContinueGameEvent)
  yield fork(handleGoToPackagePage)
  yield fork(handleSingOutEvent)
  yield fork(handleInitSignIn)
  yield fork(handleFinishPackageEvent)
  yield fork(handleNextLevelEvent)
  yield fork(handleStartNextLevel)
}
