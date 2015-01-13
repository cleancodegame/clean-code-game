var CodeSample = require("./CodeSample.js");
var LevelView = require("./LevelView.js");
var ResultsView = require("./ResultsView.js");


function removeHash () { 
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

function getHash(){
	if (window.location.hash !== undefined && window.location.hash.length > 0)
		return ~~window.location.hash.substring(1);
	else
		return 0;
}


var GameView = React.createClass({
	propTypes: {
		levels: React.PropTypes.array.isRequired,
	},

	getInitialState: function() {
		var levelIndex = ~~getHash();
		return {
			levelIndex: levelIndex,
			maxScore: 0,
			score: 0
		};
	},

	render: function() {
		if (this.state.levelIndex >= this.props.levels.length){
			_gaq.push(['_trackEvent', 'result', 'result.' + this.score, '']);
			removeHash();
			return <ResultsView	
				score={this.state.score}
				maxScore={this.state.maxScore}
				onPlayAgain={this.handlePlayAgain}/>;
		}
		else
			return <LevelView
					key={"level_" + this.state.levelIndex}
					level={this.state.levelIndex}
					score={this.state.score}
					codeSample={this.level()}
					onNext={this.handleNext} />;
	},

	level: function(index){
		index = index !== undefined ? index : this.state.levelIndex;
		if (index >= this.props.levels.length)
			throw new Error("Invalid level " + index);
		return new CodeSample(this.props.levels[index]);
	},

	handleNext: function(score){
		_gaq.push(['_trackEvent', 'level-solved', 'level-solved.' + this.levelIndex, '']);
		this.setState({
			score: score,
			maxScore: this.state.maxScore + this.level().bugsCount,
			levelIndex: this.state.levelIndex+1,
		});
	},

	handlePlayAgain: function(){
		this.setState(this.getInitialState());
	}

});

module.exports = GameView;