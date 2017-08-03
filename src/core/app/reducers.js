import * as constants from './constants'

export default function (state = {}, action) {
  const { type } = action

  switch (type) {
    case constants.NEED_AUTHORIZATION_FOR_CONTINUE:
      return { ...state, state: 'AUTHORIZATION' }
    case constants.TO_MAIN_PAGE:
      return { ...state, state: 'HOME' }
    case constants.TO_PACKAGE_PAGE:
      return { ...state, state: 'PACKAGE' }
    case constants.TO_PLAY_PAGE:
      return { ...state, state: 'IN_PLAY' }
    case constants.TO_LOAD_PAGE:
      return { ...state, state: 'LOAD' }
    case constants.TO_PACKAGE_FINISHED_PAGE:
      return { ...state, state: 'PACKAGE_FINISHED' }
    case constants.TO_GAME_FINISHED_PAGE:
      return { ...state, state: 'FINISHED' }
    default:
      return state;
  }
}
