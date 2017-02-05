import React from 'react'
import cat from '../img/cat.png'

export default class IntroView extends React.Component {
	render() {
  	return <div className="container body">
  		<div className="home-text">
  			<p>
  				Все хотят иметь дело только
  				<br />
  				с понятным чистым кодом.
  				<br />
  				Но не все могут его создавать.
  			</p>
  			<p >
  				Проверь себя!
  			</p>
  			<p >
  				<button
  					className="btn btn-lg btn-primary btn-styled"
  					onClick={this.props.onStartGame}>
  					Начать игру
  				</button>
  			</p >
  		</div>
  		<img className="home-cat" src={cat} alt="clean code cat" />
  		<div className="clearfix"></div>
  	</div>
  }
}
