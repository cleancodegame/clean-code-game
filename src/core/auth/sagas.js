import { fork, call, put, take } from 'redux-saga/effects'
import firebase from 'firebase'

import { REQUEST_SIGN_IN, REQUEST_SIGN_OUT } from './constants.js'
import * as actions from './actions.js'

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
      yield put(actions.signIn({ user: user.user }))
      yield put(actions.successSignIn())
    } else {
      yield put(actions.failureSignIn({ error }))
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
      yield put(actions.failureSignOut({ error }))
    } else {
      yield put(actions.signOut())
      yield put(actions.successSignOut())
    }
  }
}

export default function* saga() {
  yield fork(handleRequestSignIn)
  yield fork(handleSignOut)
}
