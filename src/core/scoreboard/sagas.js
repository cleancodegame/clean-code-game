import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import * as actions from './actions'
import * as constants from './constants'

function getScores() {
  return firebase.database().ref('/scores')
    .orderByChild('score')
    .once('value')
    .then(snapshot => {
      const scores = []

      snapshot.forEach(childSnapshot => { scores.push(childSnapshot.val()) })

      return scores.sort((a, b) => a.score < b.score ? 1 : -1)
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
      yield put(actions.setScores({ scores, uid }))
      yield put(actions.successGetScores())
    }
  }
}

export default function* saga() {
  yield fork(handleGetScores)
}
