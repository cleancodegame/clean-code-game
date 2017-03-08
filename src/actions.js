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

export const GET_PACKAGES = 'GET_PACKAGES'
export const getPackages = createAction(GET_PACKAGES)

export const SUCCESS_GET_PACKAGES = 'SUCCESS_GET_PACKAGES'
export const successGetPackages = createAction(SUCCESS_GET_PACKAGES)

export const SET_PACKAGE = 'SET_PACKAGE'
export const setPackage = createAction(SET_PACKAGE)

export const START_PACKAGE = 'START_PACKAGE'
export const startPackage = createAction(START_PACKAGE)

export const GO_TO_MAIN_PAGE = 'GO_TO_MAIN_PAGE'
export const goToMainPage = createAction(GO_TO_MAIN_PAGE)

export const NEXT_LEVEL = 'NEXT_LEVEL'
export const nextLevel = createAction(NEXT_LEVEL)

export const START_NEXT_LEVEL = 'START_NEXT_LEVEL'
export const startNextLevel = createAction(START_NEXT_LEVEL)

export const FINISHED_PACKAGE = 'FINISHED_PACKAGE'
export const finishedPackage = createAction(FINISHED_PACKAGE)

export const NEED_AUTHORIZATION_FOR_CONTINUE = 'NEED_AUTHORIZATION_FOR_CONTINUE'
export const needAuthorizationForContinue = createAction(NEED_AUTHORIZATION_FOR_CONTINUE)

export const AUTHORIZATION_FOR_CONTINUE_SUCCESS = 'AUTHORIZATION_FOR_CONTINUE_SUCCESS'
export const authorizationForContinueSuccess = createAction(AUTHORIZATION_FOR_CONTINUE_SUCCESS)
