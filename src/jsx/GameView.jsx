var CodeSample = require("./CodeSample");
var LevelView = require("./LevelView");
var ResultsView = require("./ResultsView");
var GameOverView = require("./GameOverView");
var tracker = require("./Tracker");

var GameView = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	render: function() {
		var m = this.getModel();
		if (m.get('score') < 0)
			return <GameOverView onPlayAgain={this.handlePlayAgain} />;
		else if (m.get('levelIndex') >= m.get('levels').length){
			return <ResultsView model={m} onPlayAgain={this.handlePlayAgain}/>;
		}
		else 
			return <LevelView key={m.get('levelIndex')} model={m} />;
	},

	handlePlayAgain: function(){
		this.getModel().reset();
	}

});

module.exports = GameView;