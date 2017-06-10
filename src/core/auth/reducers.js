import { SIGN_IN, SIGN_OUT, TURN_ON_ADMIN, OPEN_AUTH_MODAL, CLOSE_AUTH_MODAL } from './constants.js'
import { omit } from 'lodash'

export default function (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case SIGN_IN:
      return { ...state, uid: payload.user.uid, userName: payload.user.displayName, isAdmin: payload.isAdmin || false }
    case SIGN_OUT:
      return omit(state, ['userName', 'uid', 'isAdmin'])
    case TURN_ON_ADMIN:
      return { ...state, isAdmin: true }
    case OPEN_AUTH_MODAL:
      return { ...state, modalOpen: true }
    case CLOSE_AUTH_MODAL:
      return { ...state, modalOpen: false }
    default:
      return state
  }
}
