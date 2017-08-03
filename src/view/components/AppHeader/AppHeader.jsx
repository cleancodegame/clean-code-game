import React, { Component } from 'react';
import classnames from 'classnames';

import './AppHeader.css';

export default class AppHeader extends Component {
  render() {
    const isUserLogin = Boolean(this.props.userName)

    return <div className="header">
      <div className="container header">
        <div className={classnames("header-text", "header-conteiner-text", { "tall": this.props.tall })}>
          <div className="header-controls">
            <div onClick={this.props.handleToScoreboard}>
              <div className="header-scoreboard-link">
                Рейтинг
              </div>
            </div>
            <div className="header-login">
              <span className="header-login-username">{ isUserLogin ? this.props.userName : '' }</span>
              {isUserLogin && <div className="header-login-link" onClick={this.props.handleLogout}>Выйти</div>}
              {isUserLogin || <div className="header-login-provider">
                <div className="header-login-link" onClick={this.props.handleAuthModalOpen}>Войти</div>
              </div>}
            </div>
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
