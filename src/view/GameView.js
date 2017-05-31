import React, { Component } from 'react'
import {connect} from 'react-redux'
import LevelView from './components/LevelView'
import GameResultsView from './components/GameResultsView'
import PackageResult from './components/PackageResult'
import GameOverView from './components/GameOverView'
import IntroView from './components/IntroView'
import PackageView from './components/PackageView'
import RequestAuthorizationView from './components/RequestAuthorizationView'
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
          isAdmin={this.props.isAdmin}
          heatMap={this.props.heatMap}
  			/>
      case 'AUTHORIZATION':
        return <RequestAuthorizationView
          onContinueGame={this.props.handleContinueGame}
        />
  		case 'FAILED':
        return <GameOverView handlePlayAgain={this.props.restartGame} />
      case 'PACKAGE_FINISHED':
        const packagesIds = Object.keys(this.props.packages)
        const nextPackageId = packagesIds[packagesIds.indexOf(this.props.packageId) + 1]

        return <PackageResult
          handleStartPackage={this.props.handleStartPackage}
          maxPossibleScore={this.props.maxPossibleScore}
          totalScore={this.props.totalScore}
          packageId={this.props.packageId}
          nextPackageId={nextPackageId}
        />
      case 'FINISHED':
        let maxScore = 0
        let score = 0

        Object.keys(this.props.finishedPackages)
          .forEach((packageId) => {
             const { score: packageScore, maxScore: maxPackageScore }
              = this.props.finishedPackages[packageId]

            if (packageId === this.props.packageId) {
              maxScore += this.props.maxPossibleScore
              score += this.props.totalScore
            } else {
              maxScore += maxPackageScore || 0
              score += packageScore || 0
            }
          })

        return <GameResultsView
          handleToScoreboard={this.props.handleToScoreboard}
          handlePlayAgain={() => this.props.handleRestartPackage(this.props.packageId)}
          maxPossibleScore={maxScore}
          totalScore={score}
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
    state: state.app.state,
    packages: state.game.packages,
    finishedPackages: state.game.finishedPackages,
    game: state.game,
    maxPossibleScore: state.game.maxPossibleScore,
    totalScore: state.game.totalScore,
    uid: state.auth.uid,
    packageId: state.game.packageId,
    isAdmin: state.routing.locationBeforeTransitions.query.admin,
    heatMap: state.game.heatMap,
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
    handleContinueGame: () => dispatch(actions.loginEvent()),
    handleStartPackage: packageId => {
      dispatch(actions.restartGame())
      dispatch(actions.setPackage(packageId))
      dispatch(actions.startPackage())
    },
    onMiss: (uid, line, start, end, word) => {
      dispatch(actions.miss(word))

      if (uid) {
        dispatch(actions.setMissClick({ missClickLocation: { line, start, end, word }}))
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
    handleNextPackage: () => dispatch(actions.nextLevelEvent()),
    handleToScoreboard: () => dispatch(actions.routing('scoreboard'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameView)
