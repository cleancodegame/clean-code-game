import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import { REQUEST_SIGN_IN, REQUEST_SIGN_OUT, INIT_AUTH } from '../constants/auth.js'

import {
  successSignIn, failureSignIn,
  successSignOut, failureSignOut,
} from '../actions/authActions.js'
import { getPackages, authorizationForContinueSuccess } from '../actions/serverActions.js'

function signIn() {
  return firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(user => ({ user }))
    .catch(error => ({ error }))
}

function* handleRequestSignIn() {
  while (true) {
    yield take(REQUEST_SIGN_IN)

    const { user, error } = yield call(signIn)

    if (user && !error) {
      yield put(successSignIn({ user: user.user }))

      const inProgress = yield select(state => state.inProgress)

      if (inProgress) {
        yield put(authorizationForContinueSuccess())
      } else {
        yield put(getPackages())
      }
    } else {
      yield put(failureSignIn({ error }))
    }
  }
}

function signOut() {
  return firebase.auth().signOut()
    .catch(error => error )
}


function* handleSignOut() {
  while (true) {
    yield take(REQUEST_SIGN_OUT)

    const error = yield call(signOut)

    if (error) {
      yield put(failureSignOut({ error }))
    } else {
      yield put(successSignOut())
    }
  }
}

export default function* saga() {
  yield fork(handleRequestSignIn)
  yield fork(handleSignOut)
}
