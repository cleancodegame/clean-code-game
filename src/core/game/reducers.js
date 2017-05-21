import _ from 'lodash'
import CodeSample from '../CodeSample'
import * as constants from './constants'

const game = (state = {}, action) => {
  // Temp
  const { type, payload } = action

  console.log(state, action)
  switch (type) {
    case constants.RESTART_GAME:
      return restartGame(state)
    case constants.START_NEXT_LEVEL:
      return {...state, ...startNextLevel(state)}
    case constants.MISS:
      return {...state, ...missBug(state, payload)}
    case constants.USE_HINT:
      return {...state, ...useHint(state, payload)}
    case constants.BUG_FIX:
      return {...state, ...bugfix(state, payload.bugId, payload.bugTime)}
    case constants.SET_LEVELS:
      return {...state, levels: payload.levels}
    case constants.SET_PACKAGES:
      return {...state, packages: payload.packages, finishedPackages: payload.finishedPackages }
    case constants.SET_PACKAGE:
      return {...state, packageId: payload }
    case constants.FINISHED_PACKAGE:
      return finishedPackage(state)
    case constants.SET_LEVEL_STATISTIC:
      return {...state, ...setLevelStatistic(payload)}
    case constants.SET_MISS_CLICK:
      return {...state, missClickLocation: payload.missClickLocation }
    case constants.SET_BUG_FIX:
      return {...state, bugId: payload}
    case constants.SET_USE_HINT:
      return { ...state, hintId: payload }
    case constants.SET_START_LEVEL_TIME:
      return { ...state, startLevelTime: payload }
    case constants.SET_LEVEL_TIME:
      return { ...state, packageTime: state.packageTime +  state.bugTime - state.startLevelTime }
    default:
      return state;
  }
}

function finishedPackage(store) {
  const finishedPackages = [...store.finishedPackages, store.packageId]

  return {
    ...store,
    finishedPackages,
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
    packageTime: 0,
  }
}

function startNextLevel(state) {
  const levels = state.levels
  const nextIndex = state.currentLevelIndex + 1
  const level = levels[nextIndex]

  return {
    lastAction: 'NO',
    levels,
    levelId: level.id,
    maxPossibleScore: state.maxPossibleScore + Object.keys(level.bugs).length,
    availableHints: Object.keys(level.bugs),
    foundBugs: [],
    currentLevelIndex: nextIndex,
    currentLevel: new CodeSample(level),
    heatMap: undefined,
  }
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

function bugfix(state, bugKey, bugTime) {
    var fixedLevel = state.currentLevel.fix(bugKey);
    return {
        lastAction: "RIGHT",
        totalScore: state.totalScore + 1,
        availableHints: _.difference(state.availableHints, [bugKey]),
        foundBugs: [...state.foundBugs, state.currentLevel.bugs[bugKey]],
        currentLevel: fixedLevel,
        bugTime,
    }
}

function setLevelStatistic({ missclicks }) {
  const heatMap = {
    missclicks: {},
    maxMissClick: 1
  }

  missclicks.forEach(missclick => {
    if (!missclick.missClickLocation) {
      return
    }

    const key = missclick.missClickLocation.line + '_' + missclick.missClickLocation.start

    if (heatMap.missclicks[key]) {
      heatMap.missclicks[key].count++
      heatMap.maxMissClick = Math.max(heatMap.maxMissClick, heatMap.missclicks[key].count)

      return
    }

    heatMap.missclicks[key] = {
      count: 1,
      line: missclick.missClickLocation.line,
      start: missclick.missClickLocation.start,
      end: missclick.missClickLocation.end,
    }
  })

  return { heatMap }
}

export default game;
