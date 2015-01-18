var GameModel = require("./GameModel");
var GameView = require("./GameView");
var tracker = require("./Tracker");

var ProgressBar = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	render: function() {
		return <table className="header-progress">
					<tr>
						{
							_.map(_.keys(this.props.levels), function(level, i){
								var classes = "progress-tile" + ((i < this.props.levelIndex) ? " solved" : "");
								return <td key={level.name} className={classes} />
							}.bind(this))
						}
					</tr>
				</table>
	},
});

var AppView = React.createClass({
	mixins: [Backbone.React.Component.mixin],
	getInitialState: function() {
		return {
			started: false,
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
		    {this.state.started && <ProgressBar model={this.getModel()}/>}
		  </div>
	},

	handleHome: function(){
		window.location.reload();
	},

	renderBody: function(){
		if (this.state.started)
			return <div className="container">
					<GameView model={this.getModel()}/>
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
		      <p><button className="btn btn-lg btn-primary btn-styled" onClick={this.handleClick}>Начать игру</button></p>
		    </div>
			<img className="home-cat" src="img/cat.png" />
		    <div className="clearfix"></div>
		  </div>
	},

	handleClick: function(){
		this.setState({
			started: true
		});
	},

	handleKonturClick: function(){
		tracker.track("career");
	},

	renderFooter: function(){
		return <div className="footer">
			    <div className="container">
			      <p className="text-muted">
			        © 2015 <a href="https://kontur.ru/career" onClick={this.handleKonturClick}>СКБ Контур</a>. Связаться с <a href="mailto:pe@kontur.ru">автором</a>.
			      </p>
			    </div>
			  </div>;
	}
});

React.render(<AppView model={new GameModel()} />, document.getElementById("app"));