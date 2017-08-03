import { fork, call, put, take, select } from 'redux-saga/effects'
import firebase from 'firebase'

import { REQUEST_SIGN_IN, REQUEST_SIGN_OUT, INIT_SUCCESS_SIGN_IN } from './constants.js'
import * as actions from './actions.js'

function signIn(providerName) {
  const provider = providerName === 'github'
    ? new firebase.auth.GithubAuthProvider()
    : new firebase.auth.GoogleAuthProvider()


  return firebase.auth().signInWithPopup(provider)
    .then(user => ({ user }))
    .catch(error => ({ error }))
}

function checkAdmin(uid) {
  return firebase.database().ref('/admins').orderByChild("uid").equalTo(uid).once('value')
    .then(snap => snap.val() !== null)
    .catch((e) => console.log(e))
}

function* handleRequestSignIn() {
  while (true) {
    const { payload: provider } = yield take(REQUEST_SIGN_IN)

    const { user, error } = yield call(signIn, provider)

    if (user && !error) {
      const isAdmin = yield call(checkAdmin, user.user.uid)

      if (isAdmin) {
        yield put(actions.turnOnAdmin())
      }
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

function* initSuccessSignIn() {
  while(true) {
    yield take(INIT_SUCCESS_SIGN_IN)

    const { uid } = yield select(state => state.auth)

    const isAdmin = yield call(checkAdmin, uid)

    if (isAdmin) {
      yield put(actions.turnOnAdmin())
    }
  }
}

export default function* saga() {
  yield fork(handleRequestSignIn)
  yield fork(handleSignOut)
  yield fork(initSuccessSignIn)
}
