import firebase from 'firebase'
import { createAction } from 'redux-actions'
import {
  REQUEST_SIGN_IN,
  SUCCESS_SIGN_IN,
  FAILURE_SIGN_IN,
  REQUEST_SIGN_OUT,
  SUCCESS_SING_OUT,
  FAILURE_SIGN_OUT,
} from '../constants/auth.js'
import { getPackages } from './serverActions'

export const requestSignIn = createAction(REQUEST_SIGN_IN)
export const successSignIn = createAction(SUCCESS_SIGN_IN)
export const failureSignIn = createAction(FAILURE_SIGN_IN)
export const requestSignOut = createAction(REQUEST_SIGN_OUT)
export const successSignOut = createAction(SUCCESS_SING_OUT)
export const failureSignOut = createAction(FAILURE_SIGN_OUT)

export function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(successSignIn({ user }))
        // TODO убрать из авторизации
        dispatch(getPackages())
      }

      resolve()
    }, error => reject(error))
  })
}
