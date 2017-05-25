import firebase from 'firebase'
import { browserHistory } from 'react-router'
import { fork, put, take, select, call } from 'redux-saga/effects'

import * as constants from './constants'
import { SUCCESS_SIGN_IN } from '../auth/constants'
import { SUCCESS_GET_PACKAGES, START_NEXT_LEVEL } from '../game/constants'
import * as actions from './actions.js'
import {
  getPackages,
  sendStartLevel,
  writeResultPackage,
  startNextLevel,
  setLevelStatistic,
} from '../game/actions'
import { requestSignIn, requestSignOut } from '../auth/actions'
import { getScores } from '../scoreboard/actions'

function* handleContinueGameEvent() {
  while(true) {
    yield take(constants.LOGIN_EVENT)

    yield put(requestSignIn())

    const pathName = yield select(state => state.routing.locationBeforeTransitions.pathname)

    if (pathName === '/') {
      yield take(SUCCESS_SIGN_IN)
      yield put(actions.goToPackagePage())
    }
  }
}

function* handleGoToPackagePage() {
  while(true) {
    yield take(constants.GO_TO_PACKAGE_PAGE)

    yield put(actions.toLoadPage())

    yield put(getPackages())

    yield take(SUCCESS_GET_PACKAGES)
    yield put(actions.toPackagePage())
  }
}

function* handleSingOutEvent() {
  while(true) {
    yield take(constants.SING_OUT_EVENT)

    yield put(requestSignOut())

    const pathName = yield select(state => state.routing.locationBeforeTransitions.pathname)

    if (pathName === '/') {
      yield put(actions.toMainPage())
    }

    if (pathName === '/scoreboard') {
      yield put(getScores())
    }
  }
}

function* handleInitSignIn() {
  while(true) {
    yield take(constants.INIT_GAME)

    const pathName = yield select(state => state.routing.locationBeforeTransitions.pathname)

    if (pathName === '/') {
      const { uid } = yield select(state => state.auth)

      if (uid) {
        yield put(actions.goToPackagePage())
      }
    }

    if (pathName === '/scoreboard') {
      yield put(getScores())
    }
  }
}

function* handleFinishPackageEvent() {
  while (true) {
    yield take(constants.FINISH_PACKAGE_EVENT)

    const { uid } = yield select(state => state.auth)

    if (uid) {
      yield put(writeResultPackage())
      yield put(actions.goToPackagePage())
    } else {
      yield put(actions.goToAuthorizationPage())
      yield take(SUCCESS_SIGN_IN)

      const { levels, currentLevelIndex } = yield select(state => state.game)
      const isFinishedPackage = levels.length - 1 <= currentLevelIndex

      if (isFinishedPackage) {
        yield put(writeResultPackage())
        yield put(actions.goToPackagePage())
      }
    }
  }
}


function* handleNextLevelEvent() {
  while (true) {
    yield take(constants.NEXT_LEVEL_EVENT)

    const isFinishedPackage = ({ game }) =>
      game.levels.length - 1 <= game.currentLevelIndex
    const isFinished = yield select(isFinishedPackage)

    if (isFinished) {
      yield put(actions.finishPackageEvent())
    } else {
      yield put(startNextLevel())
    }
  }
}

function* handleStartNextLevel() {
  while (true) {
    yield take(START_NEXT_LEVEL)
    yield put(sendStartLevel())

    const needStatistic = yield select(state =>
      state.auth.isAdmin && state.routing.locationBeforeTransitions.query.admin === 'true'
    )

    if (needStatistic) {
      yield put(actions.getLevelStatistic())
    }

    yield put(actions.toPlayPage())
  }
}

function getLevelStatistic(levelId) {
  return firebase.database().ref('/userActions')
    .orderByChild('levelId')
    .equalTo(levelId)
    .once('value')
    .then(snapshot => {
      const missclicks = []

      snapshot.forEach(childSnapshot => {
        const value = childSnapshot.val()

        if (value.action === 'missclick') {
          missclicks.push(value)
        }
      })

      return { missclicks }
    })
    .catch((e) => console.log(e))
}

function* handleGetLevelStatistic() {
  while (true) {
    yield take(constants.GET_LEVEL_STATISTIC)

    const { levelId } = yield select(state => state.game)

    const { missclicks } = yield call(getLevelStatistic, levelId)

    if (missclicks) {
      yield put(setLevelStatistic({ missclicks }))
    }
  }
}

function* handleRouting() {
  while (true) {
    const action = yield take(constants.ROUTING)

    browserHistory[action.payload.method](action.payload.nextUrl)

    // TODO Make it another way
    yield put(actions.initGame())
  }
}

export default function* saga() {
  yield fork(handleContinueGameEvent)
  yield fork(handleGoToPackagePage)
  yield fork(handleSingOutEvent)
  yield fork(handleInitSignIn)
  yield fork(handleFinishPackageEvent)
  yield fork(handleNextLevelEvent)
  yield fork(handleStartNextLevel)
  yield fork(handleGetLevelStatistic)
  yield fork(handleRouting)
}
