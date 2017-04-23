import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import { successGetScores } from './actions'
import { GET_SCORES } from './constants'

function getScores(uid) {
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

function* handleGetScores() {
  while (true) {
    yield take(GET_SCORES)

    const { uid } = yield select(state => state.auth)

    if (!uid) {
      return
    }

    const { scores } = yield call(getScores, uid)

    if (scores) {
      yield put(successGetScores({ scores }))
    }
  }
}

export default function* saga() {
  yield fork(handleGetScores)
}
