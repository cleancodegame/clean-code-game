import { createAction } from 'redux-actions'

export function restartGame(levelIndex, score) {
    return { type: "RESTART_GAME", levelIndex, score };
}

export function startLevel(levelIndex, level) {
    return { type: "START_LEVEL", levelIndex, level };
}

export function useHint(hintId) {
    return { type: "USE_HINT", hintId };
}

export function miss(miss) {
    return { type: "MISS", miss };
}

export function bugfix(bug) {
    return { type: "BUGFIX", bug };
}

export function next(level) {
    return { type: "NEXT", level};
}

export function signIn() {
  return { type: "SIGN_IN" };
}

export function signOut() {
  return { type: "SIGN_OUT" };
}

export const REQUEST_SIGN_IN = 'REQUEST_SIGN_IN'
export const SUCCESS_SIGN_IN = 'SUCCESS_SIGN_IN'
export const FAILURE_SIGN_IN = 'FAILURE_SIGN_IN'
export const REQUEST_SIGN_OUT = 'REQUEST_SIGN_OUT'
export const SUCCESS_SING_OUT = 'SUCCESS_SING_OUT'
export const FAILURE_SIGN_OUT = 'FAILURE_SIGN_OUT'

export const requestSignIn = createAction(REQUEST_SIGN_IN)
export const successSignIn = createAction(SUCCESS_SIGN_IN)
export const failureSignIn = createAction(FAILURE_SIGN_IN)
export const requestSignOut = createAction(REQUEST_SIGN_OUT)
export const successSignOut = createAction(SUCCESS_SING_OUT)
export const failureSignOut = createAction(FAILURE_SIGN_OUT)

export const GET_LEVELS = 'GET_LEVELS'
export const getLevels = createAction(GET_LEVELS)

export const SUCCESS_GET_LEVELS = 'SUCCESS_GET_LEVELS'
export const successGetLevels = createAction(SUCCESS_GET_LEVELS)
