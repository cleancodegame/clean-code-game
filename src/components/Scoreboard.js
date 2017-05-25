import { connect } from 'react-redux'

import React from 'react'
import AppPage from './AppPage'

import './Scoreboard.css'

function Scoreboard({auth, scoreboard}) {
  return (
    <AppPage tallHeader={false}>
      <h1 className="scoreboard-title">Рейтинг</h1>
      <div className="scoreboard-header">
        <h2 className="scoreboard-rank">Место</h2>
        <h2 className="scoreboard-name">Имя</h2>
        <h2 className="scoreboard-points">Очки</h2>
      </div>
      { scoreboard.scores.map(score => {
        return (
          <div className="scoreboard-item" key={score.uid}>
            <div className="scoreboard-rank">{ score.index }</div>
            <div className="scoreboard-name">{ score.userName }</div>
            <div className="scoreboard-points">{ score.score }</div>
          </div>)
      }) }
      { scoreboard.userScores.length !== 0 && <div className="scoreboard-breaker" /> }
      { scoreboard.userScores.length !== 0 && (
        scoreboard.userScores.map(score => {
          return (
            <div className="scoreboard-item" key={score.uid}>
              <div className="scoreboard-rank">{ score.index }</div>
              <div className="scoreboard-name">{ score.userName }</div>
              <div className="scoreboard-points">{ score.score }</div>
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

export default connect(mapStateToProps)(Scoreboard)
