import { fork } from 'redux-saga/effects'
import auth from './auth'
import levels from './levels'
import userActions from './userActions'

export default function* rootSaga() {
  yield [
    fork(auth),
    fork(levels),
    fork(userActions)
  ]
}
