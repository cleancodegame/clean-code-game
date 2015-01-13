var GameView = require("./GameView.js");

function renderGame(component){
	React.render(component, document.getElementById("gameContainer"));
};

var AppView = React.createClass({
	propTypes: {
		levelsHolder: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
			started: false
		};
	},
	render: function() {
		return (
			<div>
				{this.renderHeader()}
			  	{this.renderBody()}
				{this.renderFooter()}
			  </div>
			  );
	},

	renderHeader: function(){
		var classes = "header-text" + (this.state.started ? '' : ' tall');
		return <div className="header">
		    <div className="container header">
		      <div className={classes}>
		      <h1 className="pointer" onClick={this.handleHome}>The Clean Code Game</h1>
		      <h2>Версия C#</h2>
		      </div>
		    </div>
		  </div>
	},

	handleHome: function(){
		window.location.reload();
	},

	renderBody: function(){
		if (this.state.started)
			return <div className="container">
					<GameView levels={this.props.levelsHolder.levels} />
				</div>
		else
			return this.renderIntro();
	},

	renderIntro: function(){
		return <div className="container body">
		    <div className="home-text"> 
		      <p>
		        Все хотят иметь дело только<br/>
		        с понятным чистым кодом.<br/>
		        Но не все могут его создавать.
		      </p>
		      <p>Проверь себя!</p>
		      <p><a className="btn btn-primary btn-lg" onClick={this.handleClick}>Начать игру</a></p>
		    </div>
		    <img className="home-cat" src="img/cat.svg" />
		    <div className="clearfix"></div>
		  </div>
	},

	handleClick: function(){
		if (this.props.levelsHolder.ready){
			this.setState({
				started: true
			});
		}
	},

	renderFooter: function(){
		return <div className="footer">
			    <div className="container">
			      <p className="text-muted">
			        © 2015 <a href="https://kontur.ru/career">СКБ Контур</a>
			      </p>
			    </div>
			  </div>;
	}
});

React.render(<AppView levelsHolder={levelsHolder} />, document.getElementById("app"));