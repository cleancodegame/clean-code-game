import React, { Component } from 'react';
import classnames from 'classnames';

import './AppHeader.css';

export default class AppHeader extends Component {
  render() {
    const isUserLogin = Boolean(this.props.userName)

    return <div className="header">
      <div className="container header">
        <div className={classnames("header-text", "header-conteiner-text", { "tall": this.props.tall })}>
          <div className="header-login">
            <span className="header-login-username">{ isUserLogin ? this.props.userName : '' }</span>
            {isUserLogin && <a className="header-login-link" href="#" onClick={this.props.handleLogout}>Выйти</a>}
            {isUserLogin || <a className="header-login-link" href="#" onClick={this.props.handleLogin}>Войти</a>}
          </div>
          <h1 className="header-name-text pointer" onClick={this.props.handleToMainPage}>
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
