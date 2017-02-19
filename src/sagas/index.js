import { fork } from 'redux-saga/effects'
import auth from './auth'
import levels from './levels'

export default function* rootSaga() {
  yield [
    fork(auth),
    fork(levels)
  ]
}
