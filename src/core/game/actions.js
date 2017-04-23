import { createAction } from 'redux-actions'
import * as constants from './constants.js'

export const restartGame = createAction(constants.RESTART_GAME)
export const useHint = createAction(constants.USE_HINT)
export const miss = createAction(constants.MISS)
export const bugfix = createAction(constants.BUGFIX)
export const goToMainPage = createAction(constants.GO_TO_MAIN_PAGE)
export const nextLevel = createAction(constants.NEXT_LEVEL)
export const setLevelTime = createAction(constants.SET_LEVEL_TIME)
export const finishPackage = createAction(constants.FINISH_PACKAGE)
