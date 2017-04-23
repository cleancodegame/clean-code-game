import { createAction } from 'redux-actions'
import * as constants from './constants'

export const getScores = createAction(constants.GET_SCORES)
export const successGetScores = createAction(constants.SUCCESS_GET_SCORES)
