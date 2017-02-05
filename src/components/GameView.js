import React from 'react';
import {connect} from 'react-redux'
import LevelView from "./LevelView";
import GameResultsView from "./GameResultsView";
import GameOverView from "./GameOverView";
import {restartGame, startLevel, bugfix, miss, useHint, next} from '../actions';
// import levels from '../levels';
import database from '../database'
import IntroView from './IntroView'

// database.ref('/').once('value', snap => {
//   const invite = snap.val();
// });

let levels = [];


console.log(levels)

// console.log(database.ref('/').once('value', snap => {
//   console.log('!!!!!!!')
//   level = snap.val()
// }))

function getLevelIndexFromHash() {
	if (window && window.location && window.location.hash !== undefined && window.location.hash.length > 0)
		return Math.max(0, ~~window.location.hash.substring(1) - 1);
	else
		return 0;
}

function restartDispatcher(game, dispatch){
	const levelIndex = getLevelIndexFromHash();
	return () => {
    database.ref('/levels').once('value', snap => {
      const returnedLevels = snap.val()
      const levels = Object.keys(returnedLevels).map(key => returnedLevels[key])
      console.log(levels[levelIndex])

      // dispatch(restartGame(game.currentLevelIndex, game.score));
      dispatch(startLevel(levelIndex, levels[levelIndex]));
    })
	};
}
function onNext(game, dispatch) {
  return () => {
    database.ref('/levels').once('value', snap => {
      const returnedLevels = snap.val()
      const levels = Object.keys(returnedLevels).map(key => returnedLevels[key])

      dispatch(next(levels[game.currentLevelIndex + 1]))
    })
    .catch( (e) => console.log(e))
  }
}


function GameView({game, onStartGame, dispatch}) {
	switch (game.state) {
		case 'HOME': return <IntroView onStartGame={restartDispatcher(game, dispatch)} />
		case 'IN_PLAY':
			return <LevelView
				game={game}
				onBugFix={b =>{dispatch(bugfix(b))}}
				onMiss={word =>{dispatch(miss(word))}}
				onUseHint={hintId => {dispatch(useHint(hintId))}}
				onNext={onNext(game, dispatch)}
				/>
		case 'FAILED': return <GameOverView onPlayAgain={restartDispatcher(game, dispatch)} />
		case 'FINISHED': return <GameResultsView  onPlayAgain={restartDispatcher(game, dispatch)} game={game} />
		default: return <div>Unknown game state: {game.state}</div>
	}
}


export default connect()(GameView);
