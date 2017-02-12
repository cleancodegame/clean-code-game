import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux'
import {signIn, signOut, requestSignIn, requestSignOut} from '../actions';
import firebase from 'firebase'

class AppHeader extends Component {
  login = () => this.props.dispatch(requestSignIn())
  logout = () => this.props.dispatch(requestSignOut())

  render() {
    return <div className="header">
      <div className="container header">
        <a className="navbar nav nav-item nav-link float-xs-right" href="#" onClick={this.login}>войти</a>
        <a className="navbar nav nav-item nav-link float-xs-right" href="#" onClick={this.logout}>выйти</a>
        <div className="navbar brand float-xs-right">
          <img className="userpic d-inline-block align-top" />
          <span className="username">{ this.props.userName }</span>
        </div>
        <div className={classnames("header-text", { "tall": this.props.tall })}>
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

function AppPage(props) {
  console.log(props)
  const {tallHeader, children, dispatch, userName} = props
  return (
    <div>
      <AppHeader tall={tallHeader} dispatch={dispatch} userName={userName} />
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
