import { createAction } from 'redux-actions'
import * as constants from './constants'

export const initScoreboard = createAction(constants.INIT_SCOREBOARD)

export const getScores = createAction(constants.GET_SCORES)
export const setScores = createAction(constants.SET_SCORES)
export const successGetScores = createAction(constants.SUCCESS_GET_SCORES)

export const updateScore = createAction(constants.UPDATE_SCORE)
