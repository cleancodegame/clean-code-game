import React from 'react'
import { connect } from 'react-redux'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import actions from '../core/actions'
import AuthModal from './components/AuthModal'

function AppPage(props) {
  return (
    <div>
      <AuthModal
        open={props.authModalOpen}
        handleClose={props.handleAuthModalClose}
        handleLogin={props.handleLogin}
      />
      <AppHeader
        tallHeader={props.tallHeader}
        userName={props.userName}
        handleAuthModalOpen={props.handleAuthModalOpen}
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
    authModalOpen: state.auth.modalOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLogin: provider => {
      dispatch(actions.loginEvent(provider))
      dispatch(actions.closeAuthModal())
    },
    handleLogout: () => dispatch(actions.singOutEvent()),
    handleToMainPage: () => dispatch(actions.routing('')),
    handleToScoreboard: () => dispatch(actions.routing('scoreboard')),
    handleAuthModalClose: () => dispatch(actions.closeAuthModal()),
    handleAuthModalOpen: () => dispatch(actions.openAuthModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPage)
