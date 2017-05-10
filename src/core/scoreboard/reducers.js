import * as constants from './constants.js'

export default function (state = {}, action) {
  const { type, payload } = action

  switch (type) {
    case constants.SET_SCORES:
      return setScores(state, payload.scores, payload.uid)
    default:
      return state
  }
}

function setScores(state, scores, uid) {
  let userPosition = 0

  const sortedScores = scores.sort((a, b) => {
    if (a.score > b.score) {
      return -1
    }

    if (a.score < b.score) {
      return 1
    }

    return a.time > b.time ? 1 : -1
  })
  .map((score, index) => {
    if (score.uid === uid) {
      userPosition = index
    }

    return { ...score, index: index + 1 }
  })

  if (!uid || userPosition < 10) {
    return {
      ...state,
      scores: sortedScores.slice(0, 15),
      userScores: [],
    }
  }

  return {
    ...state,
    scores: sortedScores.slice(0, 5),
    userScores: sortedScores.slice(userPosition - 5, userPosition + 5),
  }
}
