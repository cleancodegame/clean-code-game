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
  render() {
    switch (this.props.state) {
  		case 'HOME':
        return <IntroView onContinueGame={this.props.handleContinueGame} onStartGame={this.props.handleStartGame} />
      case 'PACKAGE':
        return <PackageView
          packages={this.props.packages}
          finishedPackages={this.props.finishedPackages}
          startPackage={this.props.handleStartPackage}
        />
  		case 'IN_PLAY':
  			return <LevelView
          uid={this.props.uid}
  				game={this.props.game}
  				onBugFix={this.props.onBugFix}
  				onMiss={this.props.onMiss}
  				onUseHint={this.props.onUseHint}
  				onNext={this.props.handleNextLevel}
  			/>
      case 'AUTHORIZATION':
        return <RequestAuthorizationView
          onContinueGame={this.props.handleContinueGame}
        />
  		case 'FAILED':
        return <GameOverView handlePlayAgain={this.props.restartGame} />
  		case 'FINISHED':
        return <GameResultsView
          handlePlayAgain={this.props.restartGame}
          maxPossibleScore={this.props.maxPossibleScore}
          totalScore={this.props.maxPossibleScore}
        />
      case 'LOAD':
        return <div />
  		default:
        return <div>Unknown game state: {this.props.state}</div>
  	}
  }
}

const mapStateToProps = state => {
  return {
    state: state.user.state,
    packages: state.game.packages,
    finishedPackages: state.game.finishedPackages,
    game: state.game,
    maxPossibleScore: state.game.maxPossibleScore,
    totalScore: state.game.totalScore,
    uid: state.auth.uid,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    restartGame: () => dispatch(actions.restartGame()),
    handleStartGame: () => {
      dispatch(actions.restartGame())
      dispatch(actions.setPackage('0'))
      dispatch(actions.startPackage())
    },
    handleContinueGame: () => dispatch(actions.continueGameEvent()),
    handleStartPackage: packageId => {
      dispatch(actions.restartGame())
      dispatch(actions.setPackage(packageId))
      dispatch(actions.startPackage())
    },
    onMiss: (uid, line, ch, word) => {
      dispatch(actions.miss(word))

      if (uid) {
        dispatch(actions.setMissClick({ missClickLocation: { line, ch, word }}))
        dispatch(actions.sendMissClick())
      }
    },
    onBugFix: bugId => {
      dispatch(actions.setBugFix(bugId))
      dispatch(actions.findBug())
    },
    onUseHint: (uid, hintId) => {
      if (uid) {
        dispatch(actions.setUseHint(hintId))
        dispatch(actions.sendUseHint())
      }

      dispatch(actions.useHint(hintId))
    },
    handleNextLevel: () => dispatch(actions.nextLevelEvent()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView)
