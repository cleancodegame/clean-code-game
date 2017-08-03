import React from 'react'
import cat from '../../img/cat.png'

export default class IntroView extends React.Component {
	render() {
  	return <div className="container body">
  		<div className="home-text">
        <p>
  				Поздравляем!
  			</p>
        <p>
         Вы прошли обучающие уровни!
        </p>
        <p>
  				Получи больше уровней сразу после авторизации!
  			</p>
  			<p>
	  			<button
	  				className="btn btn-lg btn-primary btn-styled IntroView-button-continue"
	  				onClick={this.props.onContinueGame}>
	  				Авторизироваться
	  			</button>
				</p>
  		</div>
  		<img className="home-cat" src={cat} alt="clean code cat" />
  		<div className="clearfix"></div>
  	</div>
  }
}
