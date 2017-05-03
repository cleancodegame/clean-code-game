import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as actions from './actions'
import * as constants from './constants'

function getScores(uid) {
  return firebase.database().ref('/scoreboard').orderByChild("totalScore").equalTo(uid).once('value')
    .then(snap => {
      return snap.val()
    })
    .catch((e) => console.log(e))
}

function* handleGetScores() {
  while (true) {
    yield take(constants.GET_SCORES)

    // Пока общий, без пользователя
    const { uid } = yield select(state => state.auth)
    const scores = yield call(getScores, uid)

    if (scores) {
      yield put(actions.setScores({ scores }))
      yield put(actions.successGetScores())
    }
  }
}

function updateScore(uid, userName, packageId totalScore, maxPossibleScore, packageTime) {
  // Спросить есть ли старый
  // если есть обновить
  // иначе записать

  // обновить скореборд
}

function* handleUpdateScore() {
  while (true) {
    yield take(constants.UPDATE_SCORE)

    const { packageId, totalScore, maxPossibleScore, packageTime } = yield select(state => state.game)
    const { uid, userName } = yield select(state => state.auth)

    yield call(updateScore, uid, userName, packageId, totalScore, maxPossibleScore, packageTime)
  }
}


function* handleInitScoreboard() {
  while (true) {
    yield take(constants.INIT_SCOREBOARD)

    yield put(actions.getScores())
  }
}

export default function* saga() {
  yield fork(handleInitScoreboard)
  yield fork(handleGetScores)
  yield fork(handleUpdateScore)
}
