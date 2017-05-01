import * as constants from './constants.js'
import { omit } from 'lodash'

export default function (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case constants.TO_AUTHORIZATION_PAGE2:
      return { ...state, uid: payload.user.uid, userName: payload.user.displayName }
    default:
      return state
  }
}
