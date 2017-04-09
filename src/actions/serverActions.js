import { createAction } from 'redux-actions'

import {
  GET_LEVELS,
  SUCCESS_GET_LEVELS,
  GET_PACKAGES,
  SUCCESS_GET_PACKAGES,
  SET_PACKAGE,
  START_PACKAGE,
  GO_TO_MAIN_PAGE,
  START_NEXT_LEVEL,
  FINISHED_PACKAGE,
  NEED_AUTHORIZATION_FOR_CONTINUE,
  AUTHORIZATION_FOR_CONTINUE_SUCCESS,
  SET_MISS_CLICK,
  SEND_MISS_CLICK,
  SET_BUG_FIX,
  SEND_BUG_FIX,
  SET_USE_HINT,
  SEND_USE_HINT,
  SEND_FINISH_LEVEL,
  SEND_START_LEVEL,
  NEXT_LEVEL,
  END_LEVEL,
  FIND_BUG,
  SET_START_LEVEL_TIME,
} from '../constants/server.js'

export const getLevels = createAction(GET_LEVELS)
export const successGetLevels = createAction(SUCCESS_GET_LEVELS)
export const getPackages = createAction(GET_PACKAGES)
export const successGetPackages = createAction(SUCCESS_GET_PACKAGES)
export const setPackage = createAction(SET_PACKAGE)
export const startPackage = createAction(START_PACKAGE)

export const startNextLevel = createAction(START_NEXT_LEVEL)
export const finishedPackage = createAction(FINISHED_PACKAGE)

export const needAuthorizationForContinue = createAction(NEED_AUTHORIZATION_FOR_CONTINUE)
export const authorizationForContinueSuccess = createAction(AUTHORIZATION_FOR_CONTINUE_SUCCESS)

export const setMissClick = createAction(SET_MISS_CLICK)
export const sendMissClick = createAction(SEND_MISS_CLICK)

export const setBugFix = createAction(SET_BUG_FIX)
export const sendBugFix = createAction(SEND_BUG_FIX)

export const setUseHint = createAction(SET_USE_HINT)
export const sendUseHint = createAction(SEND_USE_HINT)

export const sendFinishLevel = createAction(SEND_FINISH_LEVEL)
export const sendStartLevel = createAction(SEND_START_LEVEL)

export const nextLevel = createAction(NEXT_LEVEL)
export const endLevel = createAction(END_LEVEL)
export const findBug = createAction(FIND_BUG)

export const setStartLevelTime = createAction(SET_START_LEVEL_TIME)
