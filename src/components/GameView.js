import React, { Component } from 'react'
import {connect} from 'react-redux'
import LevelView from './View/LevelView'
import GameResultsView from './View/GameResultsView'
import GameOverView from './View/GameOverView'
import IntroView from './View/IntroView'
import PackageView from './View/PackageView'
import RequestAuthorizationView from './View/RequestAuthorizationView'
import {
  restartGame,
  bugfix,
  miss,
  useHint,
  requestSignIn,
  setPackage,
  startPackage,
  nextLevel,
  setMissClick,
  sendMissClick,
  setBugFix,
  sendBugFix,
  setUseHint,
  sendUseHint,
} from '../actions'

class GameView extends Component {
  restartGame = () => {
    this.props.dispatch(restartGame())
    // this.props.dispatch(getLevels())
    // this.props.dispatch(next())
  }

  handleStartGame = () => {
    this.props.dispatch(restartGame())
    this.props.dispatch(setPackage('0'))
    this.props.dispatch(startPackage())
  }

  handleContinueGame = () => {
    this.props.dispatch(requestSignIn())
    // this.props.dispatch(getPackages())
  }

  handleStartPackage = (packageId) => {
    return () => {
      this.props.dispatch(restartGame())
      this.props.dispatch(setPackage(packageId))
      this.props.dispatch(startPackage())
    }
  }

  onMiss = (line, ch, word) => {
    this.props.dispatch(miss(word))
    if (this.props.game.uid) {
      this.props.dispatch(setMissClick({ missClickLocation: { line, ch, word }}))
      this.props.dispatch(sendMissClick())
    }
  }
  onBugFix = (bugId) => {
    if (this.props.game.uid) {
      this.props.dispatch(setBugFix(bugId))
      this.props.dispatch(sendBugFix())
    }
    this.props.dispatch(bugfix(bugId))
  }
  onUseHint = (hintId) => {
    if (this.props.game.uid) {
      this.props.dispatch(setUseHint(hintId))
      this.props.dispatch(sendUseHint())
    }
    this.props.dispatch(useHint(hintId))
  }

  render() {
    const { game, dispatch} = this.props

  	switch (game.state) {
  		case 'HOME':
        return <IntroView onContinueGame={this.handleContinueGame} onStartGame={this.handleStartGame} />
      case 'PACKAGE':
        return <PackageView
          packages={game.packages}
          finishedPackages={game.finishedPackages}
          startPackage={this.handleStartPackage}
           />
  		case 'IN_PLAY':
  			return <LevelView
  				game={game}
  				onBugFix={this.onBugFix}
  				onMiss={this.onMiss}
  				onUseHint={this.onUseHint}
  				onNext={() => dispatch(nextLevel())}
  				/>
      case 'AUTHORIZATION':
        return <RequestAuthorizationView
          onContinueGame={this.handleContinueGame}
         />
  		case 'FAILED':
        return <GameOverView onPlayAgain={this.restartGame} />
  		case 'FINISHED':
        return <GameResultsView  onPlayAgain={this.restartGame} game={game} />
      case 'LOAD':
        return <div />
  		default:
        return <div>Unknown game state: {game.state}</div>
  	}
  }
}

export default connect()(GameView);
