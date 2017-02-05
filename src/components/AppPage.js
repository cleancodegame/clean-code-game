import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux'
import {signIn, signOut} from '../actions';
import firebase from 'firebase'

function updateUserView(user) {
  document.querySelector(".username").textContent = user ? user.displayName : "anonymous";
}
window.onload = function() {
  firebase.auth().onAuthStateChanged(updateUserView);
}


function AppHeader({tall, dispatch}) {
  function login() {
		dispatch(signIn())
  }

  function logout() {
    dispatch(signOut())
  }


  return <div className="header">
      <div className="container header">

        <a className="navbar nav nav-item nav-link float-xs-right" href="#" onClick={login}>войти</a>
        <a className="navbar nav nav-item nav-link float-xs-right" href="#" onClick={logout}>выйти</a>
        <div className="navbar brand float-xs-right">
          <img className="userpic d-inline-block align-top" />
          <span className="username"></span>
        </div>

          <div className={classnames("header-text", { "tall": tall })}>
              <h1 className="pointer" onClick={() => window.location.reload()}>
                  The Clean Code Game
              </h1>
              <h2>
                  Версия C#
              </h2>
          </div>
      </div>
  </div>
}

function AppFooter() {
    return <div className="footer">
        <div className="container">
            <p className="text-muted">
                ©2015&nbsp;
                <a href="https://kontur.ru/career">
                    СКБ Контур
                </a>. Связаться с&nbsp;<a href="mailto:pe@kontur.ru">автором</a>
            </p>
        </div>
    </div>;
}

function AppPage({tallHeader, children, dispatch}) {
    return (
        <div>
            <AppHeader tall={tallHeader} dispatch={dispatch} />
            <div className="container">
                {children}
            </div>
            <AppFooter />
        </div>
    );
}


// function mapStateToProps() {
//   return {}
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(UserActions, dispatch)
//   }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

export default connect()(AppPage);
// export default AppPage;
