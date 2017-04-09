import { createAction } from 'redux-actions'

import {
  RESTART_GAME,
  USE_HINT,
  MISS,
  BUGFIX,
  GO_TO_MAIN_PAGE,
  NEXT_LEVEL,
  SET_LEVEL_TIME,
} from '../constants/game.js'

export const restartGame = createAction(RESTART_GAME)
export const useHint = createAction(USE_HINT)
export const miss = createAction(MISS)
export const bugfix = createAction(BUGFIX)
export const goToMainPage = createAction(GO_TO_MAIN_PAGE)
export const nextLevel = createAction(NEXT_LEVEL)
export const setLevelTime = createAction(SET_LEVEL_TIME)
