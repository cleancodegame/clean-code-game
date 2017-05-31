import { createAction } from 'redux-actions'
import * as constants from './constants.js'

export const initGame = createAction(constants.INIT_GAME)

export const goToAuthorizationPage = createAction(constants.NEED_AUTHORIZATION_FOR_CONTINUE)
export const goToPackagePage = createAction(constants.GO_TO_PACKAGE_PAGE)
export const toPackagePage = createAction(constants.TO_PACKAGE_PAGE)
export const toMainPage = createAction(constants.TO_MAIN_PAGE)
export const toPlayPage = createAction(constants.TO_PLAY_PAGE)
export const toLoadPage = createAction(constants.TO_LOAD_PAGE)

export const loginEvent = createAction(constants.LOGIN_EVENT)
export const singOutEvent = createAction(constants.SING_OUT_EVENT)

export const finishPackageEvent = createAction(constants.FINISH_PACKAGE_EVENT)
export const nextLevelEvent = createAction(constants.NEXT_LEVEL_EVENT)

export const getLevelStatistic = createAction(constants.GET_LEVEL_STATISTIC)
export function routing(url) {
  return {
    type: constants.ROUTING,
    payload: {
      method: 'replace',
      nextUrl: '/' + url,
    }
  }
}
