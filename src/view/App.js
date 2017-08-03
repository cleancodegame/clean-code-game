import React from 'react'
import GameView from './GameView'
import AppPage from './AppPage'
import { connect } from 'react-redux'
import ProgressBar from './components/ProgressBar'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

function App(props) {
  return (
    <AppPage tallHeader={props.state === 'HOME'}>
      <ProgressBar max={props.levelsCount} completed={props.currentLevelIndex} />
      <GameView />
    </AppPage>
  )
}

const mapStateToProps = state => {
  return {
    state: state.app.state,
    levelsCount: state.game.levelsCount,
    currentLevelIndex: state.game.currentLevelIndex,
 }
}

export default connect(mapStateToProps)(App)
