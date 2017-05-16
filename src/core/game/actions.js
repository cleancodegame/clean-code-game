import { createAction } from 'redux-actions'
import * as constants from './constants.js'

export const restartGame = createAction(constants.RESTART_GAME)
export const useHint = createAction(constants.USE_HINT)
export const miss = createAction(constants.MISS)
export const findBug = createAction(constants.FIND_BUG)
export const bugfix = createAction(constants.BUG_FIX)
export const setLevelTime = createAction(constants.SET_LEVEL_TIME)

export const setPackage = createAction(constants.SET_PACKAGE)
export const getPackages = createAction(constants.GET_PACKAGES)
export const setPackages = createAction(constants.SET_PACKAGES)
export const successGetPackages = createAction(constants.SUCCESS_GET_PACKAGES)

export const startNextLevel = createAction(constants.START_NEXT_LEVEL)
export const startPackage = createAction(constants.START_PACKAGE)
export const setLevels = createAction(constants.SET_LEVELS)

export const setBugFix = createAction(constants.SET_BUG_FIX)
export const setUseHint = createAction(constants.SET_USE_HINT)
export const setMissClick = createAction(constants.SET_MISS_CLICK)

export const setStartLevelTime = createAction(constants.SET_START_LEVEL_TIME)

export const sendStartLevel = createAction(constants.SEND_START_LEVEL)
export const sendMissClick = createAction(constants.SEND_MISS_CLICK)
export const sendBugFix = createAction(constants.SEND_BUG_FIX)
export const sendUseHint = createAction(constants.SEND_USE_HINT)
export const sendFinishLevel = createAction(constants.SEND_FINISH_LEVEL)

export const writeResultPackage = createAction(constants.WRITE_RESULT_PACKAGE)
