import { connect } from 'react-redux'

import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';

function Scoreboard({game, onStartGame}) {
  return (
    <AppPage tallHeader={false} userName={game.userName}>
      Scoreboard
    </AppPage>
  )
}

const mapStateToProps = (state) => {
    return {
      userName: state.auth.userName,
      scores: state.scoreboard.scores,
    }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
