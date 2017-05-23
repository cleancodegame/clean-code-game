import React from 'react'
import { connect } from 'react-redux'
import AppHeader from './View/AppHeader'
import AppFooter from './View/AppFooter'
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
    handleLogin: () => dispatch(actions.loginEvent()),
    handleLogout: () => dispatch(actions.singOutEvent()),
    handleToMainPage: () => dispatch(actions.toMainPage()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPage)
