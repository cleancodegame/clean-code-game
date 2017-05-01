import { fork } from 'redux-saga/effects'
import sagasAuth from './auth/sagas'
import sagasUserActions from './game/sagasUserActions'
import sagasPackage from './game/sagasPackage'
import sagasScoreboard from './scoreboard/sagas'
import sagasUser from './user/sagas'

export default function* rootSaga() {
  yield [
    fork(sagasAuth),
    fork(sagasUserActions),
    fork(sagasPackage),
    fork(sagasScoreboard),
    fork(sagasUser)
  ]
}
