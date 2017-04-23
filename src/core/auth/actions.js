import { createAction } from 'redux-actions'
import * as constants from './constants.js'

export const requestSignIn = createAction(constants.REQUEST_SIGN_IN)
export const signIn = createAction(constants.SIGN_IN)
export const successSignIn = createAction(constants.SUCCESS_SIGN_IN)
export const failureSignIn = createAction(constants.FAILURE_SIGN_IN)
export const requestSignOut = createAction(constants.REQUEST_SIGN_OUT)
export const signOut = createAction(constants.SIGN_OUT)
export const successSignOut = createAction(constants.SUCCESS_SING_OUT)
export const failureSignOut = createAction(constants.FAILURE_SIGN_OUT)
