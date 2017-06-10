import React, { Component } from 'react'
import './AuthModal.css'

export default class AuthModal extends Component {
  render() {
    return this.props.open
      ? <div className="AuthModal-container">
        <div className="AuthModal-background" onClick={this.props.handleClose} />
        <div className="AuthModal-block">
            <h1>Войти используя аккаунт:</h1>
            <button
  	  				className="btn btn-lg btn-primary btn-styled AuthModal-first-button"
  	  				onClick={this.props.handleLogin}
            >
  	  				Google
  	  			</button>
            <button
  	  				className="btn btn-lg btn-primary btn-styled"
  	  				onClick={() => this.props.handleLogin('github')}
            >
              GitHub
  	  			</button>
        </div>
      </div>
      : <div />
  }
}
