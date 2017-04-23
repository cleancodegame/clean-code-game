import { fork } from 'redux-saga/effects'
import sagasAuth from './auth/sagas'
import sagasUserActions from './game/sagasUserActions'
import sagasPackage from './game/sagasPackage'
import sagasScoreboard from './scoreboard/sagas'

export default function* rootSaga() {
  yield [
    fork(sagasAuth),
    fork(sagasUserActions),
    fork(sagasPackage),
    fork(sagasScoreboard)
  ]
}
