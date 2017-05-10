import { connect } from 'react-redux'

import React from 'react'
import AppPage from './AppPage'

import './Scoreboard.css'

function Scoreboard({auth, scoreboard}) {
  return (
    <AppPage tallHeader={false} userName={auth.userName}>
      <h1 className="scoreboard-title">Scoreboard</h1>
      <div className="scoreboard-header">
        <h2 className="scoreboard-rank">RANK</h2>
        <h2 className="scoreboard-name">NAME</h2>
        <h2 className="scoreboard-points">POINTS</h2>
        <h2 className="scoreboard-time">TIME</h2>
      </div>
      { scoreboard.scores.map(score => {
        return (
          <div className="scoreboard-item" key={score.uid}>
            <div className="scoreboard-rank">{ score.index }</div>
            <div className="scoreboard-name">{ score.userName }</div>
            <div className="scoreboard-points">{ score.score }</div>
            <div className="scoreboard-time">{ score.time }</div>
          </div>)
      }) }
      { scoreboard.userScores.length && <div className="scoreboard-breaker" /> }
      { scoreboard.userScores.length && (
        scoreboard.userScores.map(score => {
          return (
            <div className="scoreboard-item" key={score.uid}>
              <div className="scoreboard-rank">{ score.index }</div>
              <div className="scoreboard-name">{ score.userName }</div>
              <div className="scoreboard-points">{ score.score }</div>
              <div className="scoreboard-time">{ score.time }</div>
            </div>)
        })
      ) }
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
