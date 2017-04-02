import _ from 'lodash'
import CodeSample from './CodeSample'
import {
  RESTART_GAME,
  USE_HINT,
  MISS,
  BUGFIX,
  NEXT,
} from './constants/game.js'
import {
  SUCCESS_GET_LEVELS,
  SUCCESS_GET_PACKAGES,
  SET_PACKAGE,
  GO_TO_MAIN_PAGE,
  FINISHED_PACKAGE,
  NEED_AUTHORIZATION_FOR_CONTINUE,
  SET_MISS_CLICK,
  SET_BUG_FIX,
  SET_USE_HINT,
  START_NEXT_LEVEL
} from './constants/server.js'
import {
  SUCCESS_SIGN_IN,
  SUCCESS_SING_OUT,
} from './constants/auth.js'

const game = (state = {}, action) => {
  // Temp
  const { type, payload } = action

  console.log(state, action)
  switch (type) {
    case RESTART_GAME:
      return restartGame(state)
    case START_NEXT_LEVEL:
      return {...state, ...startNextLevel(state)}
    case MISS:
      return {...state, ...missBug(state, payload)}
    case USE_HINT:
      return {...state, ...useHint(state, payload)}
    case BUGFIX:
      return {...state, ...bugfix(state, payload)}
    case SUCCESS_SIGN_IN:
      return { ...state, uid: payload.user.uid, userName: payload.user.displayName, state: 'LOAD' }
    case SUCCESS_SING_OUT:
      return signOut(state)
    case SUCCESS_GET_LEVELS:
      return {...state, levels: payload.levels}
    case SUCCESS_GET_PACKAGES:
      return {...state, packages: payload.packages, finishedPackages: payload.finishedPackages, state: 'PACKAGE'}
    case SET_PACKAGE:
      return {...state, packageId: payload }
    case GO_TO_MAIN_PAGE:
      return goToMainPage(state)
    case FINISHED_PACKAGE:
      return finishedPackage(state)
    case NEED_AUTHORIZATION_FOR_CONTINUE:
      return {...state, state: 'AUTHORIZATION', inProgress: true}
    case SET_MISS_CLICK:
      return {...state, missClickLocation: payload.missClickLocation }
    case SET_BUG_FIX:
      return {...state, bugId: payload}
    case SET_USE_HINT:
      return {...state, hintId: payload}
    default:
      return state;
  }
}

function finishedPackage(store) {
  const finishedPackages = [...store.finishedPackages, store.packageId]

  return {
    ...store,
    state: 'PACKAGE',
    finishedPackages,
  }
}

function goToMainPage(store) {
  const state = store.userName ? 'PACKAGE' : 'HOME'

  return {
    ...store,
    state
  }
}

function restartGame(state) {
  return {
    ...state,
    lastAction: 'NO', // 'NONE|WRONG|RIGHT
    totalScore: 0,
    maxPossibleScore: 0,
    availableHints: [],
    foundBugs: [],
    misses: [],
    currentLevelIndex: -1,
    currentLevel: null, //CodeSample
    levelsCount: 0,
    packageId: 0,
  }
}

function startNextLevel(state) {
  const levels = state.levels
  const nextIndex = state.currentLevelIndex + 1
  const level = levels[nextIndex]

  return {
    state: 'IN_PLAY',
    lastAction: 'NO',
    levels,
    levelId: level.id,
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
    if (key !== 'userName' && key !== 'uid') {
      newState[key] = state[key]
    }
  }

  newState.state = 'HOME'

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

export const getCurentPackage = (state) => {
  return state.packageId
}

export default game;
