import { connect } from 'react-redux'

import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function Scoreboard({game, onStartGame}) {
  return (
    <AppPage tallHeader={game.state === 'HOME'} userName={game.userName}>
      Scoreboard
    </AppPage>
  )
}

const mapStateToProps = (state) => {
    return { game: state.game }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
