import { SIGN_IN, SING_OUT } from './constants.js'
import { omit } from 'lodash'

export default function (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case SIGN_IN:
      return { ...state, uid: payload.user.uid, userName: payload.user.displayName }
    case SING_OUT:
      return omit(state, ['userName', 'uid'])
    default:
      return state
  }
}
