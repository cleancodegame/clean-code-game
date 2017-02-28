import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'
import { getCurentPackage } from '../reducers'

import {
  GET_LEVELS, successGetLevels,
} from '../actions'


function getLevels(packageId) {
  return firebase.database().ref('/levels').orderByChild("packageId").equalTo(packageId).once('value')
    .then(snap => {
      const returnedLevels = snap.val()

      return { levels: Object.keys(returnedLevels).map(key => returnedLevels[key]) }
    })
    .catch((e) => console.log(e))
}

function* handleGetLevels() {
  while (true) {
    yield take(GET_LEVELS)

    const packageId = yield select(getCurentPackage)

    const { levels } = yield call(getLevels, packageId)

    if (levels) {
      yield put(successGetLevels({ levels }))
    }
  }
}

export default function* saga() {
  yield fork(handleGetLevels)
}
