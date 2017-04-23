import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as constants from './constants'
import * as actions from './actions'

function writeUserAction(uid, levelId, action, timeStamp, info = {}) {
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

    yield call(writeUserAction, uid, levelId, timeStamp, 'start')

    yield put(actions.setStartLevelTime(timeStamp))
  }
}

function* handleFinishLevel() {
  while (true) {
    yield take(constants.SEND_FINISH_LEVEL)

    const { uid } = yield select(state => state.auth)
    const { levelId, bugTime } = yield select(state => state.game)

    yield call(writeUserAction, uid, levelId, bugTime, 'finish')
  }
}

export default function* saga() {
  yield fork(handleMissClick)
  yield fork(handleFindBug)
  yield fork(handleBugFix)
  yield fork(handleUseHint)
  yield fork(handleStartLevel)
  yield fork(handleFinishLevel)
}
