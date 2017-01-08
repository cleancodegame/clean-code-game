export function restartGame(levelIndex, score) {
    return { type: "RESTART_GAME", levelIndex, score };
}

export function startLevel(levelIndex, level) {
    return { type: "START_LEVEL", levelIndex, level };
}

export function useHint(hintId) {
    return { type: "USE_HINT", hintId };
}

export function miss(miss) {
    return { type: "MISS", miss };
}

export function bugfix(bug) {
    return { type: "BUGFIX", bug };
}

export function next(level) {
    return { type: "NEXT", level};  
}