import _ from 'lodash'
import CodeSample from './CodeSample'
import database from './database'
import firebase from 'firebase'

const game = (state = {}, action) => {
  // console.log('11')
    switch (action.type) {
        case "RESTART_GAME": return _.assign({}, startGame());
        case "START_LEVEL": return _.assign({}, state, startLevel(state, action.levelIndex, action.level));
        case "MISS": return _.assign({}, state, miss(state, action.miss));
        case "USE_HINT": return _.assign({}, state, useHint(state, action.hintId));
        case "BUGFIX": return _.assign({}, state, bugfix(state, action.bug));
        case "NEXT": return _.assign({}, state, next(state, action.level));
        case "SIGN_IN": return { ...state, ...signIn()}
        case "SIGN_OUT": return { ...state, ...signOut()}

        default: return state;
    }
}
function signIn() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(function(error) {
      console.log(error)
      firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
  })
  return {}
}

function signOut() {
  firebase.auth().signOut()

  return {}
}

// function updateUserView(user) {
//     console.log(user);
//     $(".username").html(user ? user.displayName : "anonymous");
// }

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
