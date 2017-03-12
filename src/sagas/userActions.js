import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'
import { getCurentPackage } from '../reducers'

import {
  SEND_MISS_CLICK,
  SEND_BUG_FIX,
  SEND_USE_HINT,
  SEND_START_LEVEL,
  SEND_FINISH_LEVEL,
} from '../actions'

function writeUserAction(uid, levelId, action, info = {}) {
  firebase.database().ref('userActions').push().set({
    uid,
    levelId,
    action,
    timeStamp: Date.now(),
    ...info,
  })
}

function* handleMissClick() {
  while (true) {
    yield take(SEND_MISS_CLICK)

    let { uid, levelId, missClickLocation} = yield select(state => state)

    yield call(writeUserAction, uid, levelId, 'missclick', { missClickLocation })
  }
}

function* handleBugFix() {
  while (true) {
    yield take(SEND_BUG_FIX)

    let { uid, levelId, bugId} = yield select(state => state)

    yield call(writeUserAction, uid, levelId, 'bugfix', { bugId })
  }
}

function* handleUseHint() {
  while (true) {
    yield take(SEND_USE_HINT)

    let { uid, levelId, hintId} = yield select(state => state)

    yield call(writeUserAction, uid, levelId, 'useHint', { hintId })
  }
}

function* handleStartLevel() {
  while (true) {
    yield take(SEND_START_LEVEL)

    let { uid, levelId, hintId} = yield select(state => state)

    yield call(writeUserAction, uid, levelId, 'finish')
  }
}

function* handleFinishLevel() {
  while (true) {
    yield take(SEND_FINISH_LEVEL)

    let { uid, levelId, hintId} = yield select(state => state)

    yield call(writeUserAction, uid, levelId, 'finish')
  }
}

export default function* saga() {
  yield fork(handleMissClick)
  yield fork(handleBugFix)
  yield fork(handleUseHint)
  yield fork(handleStartLevel)
  yield fork(handleFinishLevel)
}
