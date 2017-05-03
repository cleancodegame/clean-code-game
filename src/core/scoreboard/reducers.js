import * as constants from './constants.js'

export default function (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case constants.SET_SCORES:
      return { ...state, scores: payload.scores }
    default:
      return state
  }
}
