import React, { Component } from 'react'
import {connect} from 'react-redux'
import LevelView from './View/LevelView'
import GameResultsView from './View/GameResultsView'
import GameOverView from './View/GameOverView'
import IntroView from './View/IntroView'
import PackageView from './View/PackageView'
import RequestAuthorizationView from './View/RequestAuthorizationView'
import actions from '../core/actions'

class GameView extends Component {
  restartGame = () => {
    this.props.dispatch(actions.restartGame())
    // this.props.dispatch(getLevels())
    // this.props.dispatch(next())
  }

  handleStartGame = () => {
    this.props.dispatch(actions.restartGame())
    this.props.dispatch(actions.setPackage('0'))
    this.props.dispatch(actions.startPackage())
  }

  handleContinueGame = () => {
    this.props.dispatch(actions.continueGameEvent())
  }

  handleStartPackage = (packageId) => {
    return () => {
      this.props.dispatch(actions.restartGame())
      this.props.dispatch(actions.setPackage(packageId))
      this.props.dispatch(actions.startPackage())
    }
  }

  onMiss = (line, ch, word) => {
    this.props.dispatch(actions.miss(word))
    if (this.props.auth.uid) {
      this.props.dispatch(actions.setMissClick({ missClickLocation: { line, ch, word }}))
      this.props.dispatch(actions.sendMissClick())
    }
  }
  onBugFix = (bugId) => {
    this.props.dispatch(actions.setBugFix(bugId))
    this.props.dispatch(actions.findBug())
  }
  onUseHint = (hintId) => {
    if (this.props.auth.uid) {
      this.props.dispatch(actions.setUseHint(hintId))
      this.props.dispatch(actions.sendUseHint())
    }
    this.props.dispatch(actions.useHint(hintId))
  }

  render() {
    const { game, dispatch} = this.props
    console.log('GameView', game)

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
  				onNext={() => dispatch(actions.nextLevel())}
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
