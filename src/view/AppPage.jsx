import React from 'react'
import { connect } from 'react-redux'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import actions from '../core/actions'

function AppPage(props) {
  return (
    <div>
      <AppHeader
        tallHeader={props.tallHeader}
        userName={props.userName}
        handleLogin={props.handleLogin}
        handleLogout={props.handleLogout}
        handleToMainPage={props.handleToMainPage}
        handleToScoreboard={props.handleToScoreboard}
      />
      <div className="container">
        {props.children}
      </div>
      <AppFooter />
    </div>
  );
}


const mapStateToProps = state => {
  return {
    userName: state.auth.userName,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLogin: provider => dispatch(actions.loginEvent(provider)),
    handleLogout: () => dispatch(actions.singOutEvent()),
    handleToMainPage: () => dispatch(actions.routing('')),
    handleToScoreboard: () => dispatch(actions.routing('scoreboard'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPage)
