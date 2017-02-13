import _ from 'lodash'
import CodeSample from './CodeSample'
import { SUCCESS_SIGN_IN, SUCCESS_SING_OUT } from './actions'

const game = (state = {}, action) => {
  // Temp
  const { type, payload, levelIndex, level, miss, hintId, bug } = action

  switch (type) {
    case "RESTART_GAME":
      return { ...startGame()}
    case "START_LEVEL":
      return {...state, ...startLevel(state, levelIndex, level)}
    case "MISS":
      return {...state, ...miss(state, miss)}
    case "USE_HINT":
      return {...state, ...useHint(state, hintId)}
    case "BUGFIX":
      return {...state, ...bugfix(state, bug)}
    case "NEXT":
      return {...state, ...next(state, level)}
    case SUCCESS_SIGN_IN:
      return { ...state, userName: payload.user.user.displayName }
    case SUCCESS_SING_OUT:
      return signOut(state)
    default:
      return state;
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

function startGame() {
    return {
        state: 'IN_PLAY', // HOME|IN_PLAY|FAILED|FINISHED
        lastAction: 'NO', // 'NONE|WRONG|RIGHT
        totalScore: 0,
        maxPossibleScore: 0,
        availableHints: [],
        foundBugs: [],
        misses: [],
        currentLevelIndex: 0,
        currentLevel: null, //CodeSample
        levelsCount: 0,
    }
}

function startLevel(state, levelIndex, level) {
  console.log('level', level)
    return {
        state: 'IN_PLAY',
        lastAction: 'NO',
        maxPossibleScore: state.maxPossibleScore + Object.keys(level.bugs).length,
        availableHints: Object.keys(level.bugs),
        foundBugs: [],
        currentLevelIndex: levelIndex,
        currentLevel: new CodeSample(level)
    }
}

function miss(state, miss) {
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

function bugfix(state, bug) {
    var fixedLevel = state.currentLevel.fix(bug);
    return {
        lastAction: "RIGHT",
        totalScore: state.totalScore + 1,
        availableHints: _.difference(state.availableHints, [bug.name]),
        foundBugs: _.concat(state.foundBugs, bug),
        currentLevel: fixedLevel
    }
}

function next(state, level) {
    if (level === undefined)
        return finished();
    return startLevel(state, state.currentLevelIndex+1, level);
}

function finished() {
    return {
        state: 'FINISHED',
        lastAction: 'RIGHT',
    }
}


export default game;
