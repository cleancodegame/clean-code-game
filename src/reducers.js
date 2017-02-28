import _ from 'lodash'
import CodeSample from './CodeSample'
import { SUCCESS_SIGN_IN, SUCCESS_SING_OUT, GET_LEVELS, SUCCESS_GET_LEVELS, getLevels } from './actions'

const game = (state = {}, action) => {
  // Temp
  const { type, payload, levelIndex, level, miss, hintId, bug } = action

  console.log(state, action)
  switch (type) {
    case "RESTART_GAME":
      return restartGame(state)
    // case "START_NEXT_LEVEL":
    //   return {...state, ...startNextLevel(state)}
    case "MISS":
      return {...state, ...missBug(state, miss)}
    case "USE_HINT":
      return {...state, ...useHint(state, hintId)}
    case "BUGFIX":
      return {...state, ...bugfix(state, bug)}
    case "NEXT":
      return {...state, ...next(state)}
    case SUCCESS_SIGN_IN:
      return { ...state, userName: payload.user.user.displayName }
    case SUCCESS_SING_OUT:
      return signOut(state)
    case SUCCESS_GET_LEVELS:
      return {...state, ...startNextLevel(state, payload.levels)}
    default:
      return state;
  }
}

function restartGame(state) {
  return {
    lastAction: 'NO', // 'NONE|WRONG|RIGHT
    totalScore: 0,
    maxPossibleScore: 0,
    availableHints: [],
    foundBugs: [],
    misses: [],
    currentLevelIndex: -1,
    currentLevel: null, //CodeSample
    levelsCount: 0,
  }
}

function startNextLevel(state, levels) {
  console.log('startNewLavel')
  levels = state.levels || levels
  const nextIndex = state.currentLevelIndex + 1
  const level = levels[nextIndex]

  return {
    state: 'IN_PLAY',
    lastAction: 'NO',
    levels,
    maxPossibleScore: state.maxPossibleScore + Object.keys(level.bugs).length,
    availableHints: Object.keys(level.bugs),
    foundBugs: [],
    currentLevelIndex: nextIndex,
    currentLevel: new CodeSample(level)
  }
}

function signOut(state) {
  const newState = {}

  for (const key in state) {
    if (key !== 'userName') {
      newState[key] = state[key]
    }
  }

  return newState
}

function missBug(state, miss) {
    const newScore = state.totalScore - (state.currentLevel.learning ? 0 : 1);
    if (newScore < 0) return gameOver(state);
    return {
        lastAction: "WRONG",
        totalScore: newScore,
        misses: _.concat(state.misses, miss)
    }
}

function gameOver(state) {
    return {
        state: "FAILED",
        lastAction: "WRONG",
    }
}

function useHint(state, hintId) {
    return {
        availableHints: _.difference(state.availableHints, [hintId])
    }
}

function bugfix(state, bugKey) {
    var fixedLevel = state.currentLevel.fix(bugKey);
    return {
        lastAction: "RIGHT",
        totalScore: state.totalScore + 1,
        availableHints: _.difference(state.availableHints, [bugKey]),
        foundBugs: [...state.foundBugs, state.currentLevel.bugs[bugKey]],
        currentLevel: fixedLevel
    }
}

function next(state) {
  console.log('next', state.levels.length, state.currentLevelIndex)
  if (state.levels.length - 1 <= state.currentLevelIndex) {
    return finished()
  }

  return startNextLevel(state);
}

function finished() {
    return {
        state: 'FINISHED',
        lastAction: 'RIGHT',
    }
}


export default game;
