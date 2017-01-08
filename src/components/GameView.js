import React from 'react';
import {connect} from 'react-redux'
import LevelView from "./LevelView";
import GameResultsView from "./GameResultsView";
import GameOverView from "./GameOverView";
import {restartGame, startLevel, bugfix, miss, useHint, next} from '../actions';
import levels from '../levels';
import cat from '../img/cat.png';


function IntroView({onStartGame}) {
	return <div className="container body">
		<div className="home-text">
			<p>
				Все хотят иметь дело только
				<br />
				с понятным чистым кодом.
				<br />
				Но не все могут его создавать.
			</p>
			<p >
				Проверь себя!
			</p>
			<p >
				<button
					className="btn btn-lg btn-primary btn-styled"
					onClick={onStartGame}>
					Начать игру
				</button>
			</p >
		</div>
		<img className="home-cat" src={cat} alt="clean code cat" />
		<div className="clearfix"></div>
	</div>
}


function getLevelIndexFromHash() {
	if (window && window.location && window.location.hash !== undefined && window.location.hash.length > 0)
		return Math.max(0, ~~window.location.hash.substring(1) - 1);
	else
		return 0;
}

function restartDispatcher(game, dispatch){
	const levelIndex = getLevelIndexFromHash();
	return () => { 
		dispatch(restartGame(game.currentLevelIndex, game.score));
		dispatch(startLevel(levelIndex, levels[levelIndex]));
	};
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
				onNext={() =>{dispatch(next(levels[game.currentLevelIndex+1]))}}
				/>
		case 'FAILED': return <GameOverView onPlayAgain={restartDispatcher(game, dispatch)} />
		case 'FINISHED': return <GameResultsView  onPlayAgain={restartDispatcher(game, dispatch)} game={game} />
		default: return <div>Unknown game state: {game.state}</div>
	}
}


export default connect()(GameView);