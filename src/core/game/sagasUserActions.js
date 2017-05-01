import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as constants from './constants'
import * as actions from './actions'
import { requestSignIn, requestSignOut } from '../auth/actions'
import { SUCCESS_SIGN_IN, INIT_SUCCESS_SIGN_IN } from '../auth/constants'

function writeUserAction(uid, levelId, action, timeStamp, info = {}) {
  if (!uid) {
    return
  }

  firebase.database().ref('userActions').push().set({
    uid,
    levelId,
    action,
    timeStamp,
    ...info,
  })
}

function* handleFindBug() {
  while (true) {
    yield take(constants.FIND_BUG)

    const { uid } = yield select(state => state.auth)
    const { bugId, currentLevel } = yield select(state => state.game)

    const bugTime = Date.now() //firebase.database.ServerValue.TIMESTAMP

    yield put(actions.bugfix({bugId, bugTime}))

    if (uid) {
      yield put(actions.sendBugFix())

      if (currentLevel.bugsCount === 1) {
        yield put(actions.setLevelTime())
        yield put(actions.sendFinishLevel())
      }
    }
  }
}

function* handleMissClick() {
  while (true) {
    yield take(constants.SEND_MISS_CLICK)

    const { uid } = yield select(state => state.auth)
    const { levelId, missClickLocation } = yield select(state => state.game)
    const timeStamp = Date.now() //firebase.database.ServerValue.TIMESTAMP

    yield call(writeUserAction, uid, levelId, 'missclick', timeStamp, { missClickLocation })
  }
}

function* handleBugFix() {
  while (true) {
    yield take(constants.SEND_BUG_FIX)

    const { uid } = yield select(state => state.auth)
    const { levelId, bugId, bugTime } = yield select(state => state.game)

    yield call(writeUserAction, uid, levelId, 'bugfix', bugTime, { bugId })
  }
}

function* handleUseHint() {
  while (true) {
    yield take(constants.SEND_USE_HINT)

    const { uid } = yield select(state => state.auth)
    const { levelId, hintId } = yield select(state => state.game)
    const timeStamp = Date.now() //firebase.database.ServerValue.TIMESTAMP

    yield call(writeUserAction, uid, levelId, 'useHint', timeStamp, { hintId })
  }
}

function* handleStartLevel() {
  while (true) {
    yield take(constants.SEND_START_LEVEL)

    const { uid } = yield select(state => state.auth)
    const { levelId } = yield select(state => state.game)
    const timeStamp = Date.now() //firebase.database.ServerValue.TIMESTAMP

    yield call(writeUserAction, uid, levelId, 'start', timeStamp)

    yield put(actions.setStartLevelTime(timeStamp))
  }
}

function* handleFinishLevel() {
  while (true) {
    yield take(constants.SEND_FINISH_LEVEL)

    const { uid } = yield select(state => state.auth)
    const { levelId, bugTime } = yield select(state => state.game)

    yield call(writeUserAction, uid, levelId, 'finish', bugTime)
  }
}

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

    yield put(actions.getPackages())

    yield take(constants.SUCCESS_GET_PACKAGES)
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

export default function* saga() {
  yield fork(handleMissClick)
  yield fork(handleFindBug)
  yield fork(handleBugFix)
  yield fork(handleUseHint)
  yield fork(handleStartLevel)
  yield fork(handleFinishLevel)
  yield fork(handleContinueGameEvent)
  yield fork(handleGoToPackagePage)
  yield fork(handleSingOutEvent)
  yield fork(handleInitSignIn)
}
