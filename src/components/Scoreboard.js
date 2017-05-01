import { connect } from 'react-redux'

import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';

function Scoreboard({auth, scoreboard}) {
  return (
    <AppPage tallHeader={false} userName={auth.userName}>
      Scoreboard
    </AppPage>
  )
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      scoreboard: state.scoreboard,
    }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scoreboard)
