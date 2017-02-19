import React, { Component } from 'react';
import {connect} from 'react-redux'
import LevelView from "./LevelView";
import GameResultsView from "./GameResultsView";
import GameOverView from "./GameOverView";
import {restartGame, startLevel, bugfix, miss, useHint, next, getLevels} from '../actions';
import database from '../database'
import IntroView from './IntroView'

class GameView extends Component {
  restartGame = () => {
    this.props.dispatch(restartGame())
    this.props.dispatch(getLevels())
    // this.props.dispatch(next())
  }

  render() {
    const { game, onStartGame, dispatch} = this.props

  	switch (game.state) {
  		case 'HOME':
        return <IntroView onStartGame={this.restartGame} />
  		case 'IN_PLAY':
  			return <LevelView
  				game={game}
  				onBugFix={b =>{dispatch(bugfix(b))}}
  				onMiss={word =>{dispatch(miss(word))}}
  				onUseHint={hintId => {dispatch(useHint(hintId))}}
  				onNext={() => dispatch(next())}
  				/>
  		case 'FAILED':
        return <GameOverView onPlayAgain={this.restartGame} />
  		case 'FINISHED':
        return <GameResultsView  onPlayAgain={this.restartGame} game={game} />
  		default:
        return <div>Unknown game state: {game.state}</div>
  	}
  }
}

export default connect()(GameView);
