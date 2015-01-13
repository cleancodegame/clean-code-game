var CodeView = require("./CodeView");
var CodeSample = require("./CodeSample.js");
var utils = require("./utils.js");
var animate = utils.animate;

var LevelView = React.createClass({
	propTypes: {
		level: React.PropTypes.number.isRequired,
		score: React.PropTypes.number.isRequired,
		codeSample: React.PropTypes.instanceOf(CodeSample).isRequired,
		onNext: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			codeSample : this.props.codeSample,
			score : this.props.score,
			descriptions: []
		};
	},

	handleShowHint: function(){
		console.log("hint");
	},

	finished: function(){
		return this.state.codeSample.bugsCount == 0;
	},

	trackMiss: function (line, ch, word){
		word = word.trim().substring(0, 20);
		var category = "miss."+this.props.codeSample.name;
		var miss = category + "." + word;
		console.log(miss);
		if (!this.trackedMisses[miss]){
			_gaq.push(['_trackEvent', category, miss, category + ' at ' + line + ':'+ch]);
			this.trackedMisses[miss] = true;
		}
	},

	handleClick: function(line, ch, word){
		if (this.finished()) return;
		var bug = this.state.codeSample.findBug(line, ch);

		if (bug != null){
			var descriptions = _.union(this.state.descriptions, [bug.description]);
			this.setState({
				codeSample: this.state.codeSample.fix(bug),
				score: this.state.score + 1,
				descriptions: descriptions
			});
		}
		else {
			this.trackMiss(line, ch, word);
			this.setState({
				score: this.state.score - 1,
			});
		}
	},

	componentDidMount: function() {
		this.trackedMisses = {};
	},

	componentDidUpdate: function(prevProps, prevState) {
		if (prevState.codeSample.bugsCount != this.state.codeSample.bugsCount)
			animate(this.refs.bugsCount, "bounce");
		if (prevState.score < this.state.score)
			animate(this.refs.score, "flipInX");
		else if (prevState.score > this.state.score)
			animate(this.refs.score, "rubberBand");
		if (this.finished())
			animate(this.refs.title, "flipInX");
		if (this.finished)
			animate(this.refs.nextButton, "flipInX");
	},

	handleNext: function(){
		this.props.onNext(this.state.score);
	},
	
	renderExplanations: function(){
		if (this.state.descriptions.length == 0) return "";
		return <div>
			<h3>Объяснения:</h3>
			<ol>
				{ this.state.descriptions.map(function(d, i){ return <li key={i}>{d}</li> }) }
			</ol>
		</div>
	},

	renderNextButton: function(){
		if (!this.finished()) return "";
		return <button ref="nextButton"
				className="pull-right btn btn-lg btn-success"
				onClick={this.handleNext}>Дальше</button>
	},

	render: function() {
		return  (
			<div className="round">
			  <div className="row">
				<div className="col-sm-12">
					<h2>Уровень {this.props.level+1}{this.finished() && ". Пройден!"}</h2>
					<p>Найди и исправь все стилевые ошибки в коде. Кликай мышкой по ошибкам!</p>
					<CodeView code={this.state.codeSample.text} onClick={this.handleClick} />
				</div>
			  </div>
			  <div className="row">
			  	<div className="col-sm-3">
					<div className="score">
						Счёт: <span className="score-value" ref="score">{this.state.score}</span>
					</div>
			  	</div>
			  	<div className="col-sm-6">
					<div className="score">
						Осталось найти: <span ref="bugsCount">{this.state.codeSample.bugsCount}</span>
					</div>
			  	</div>
			  	<div className="col-sm-3">
					<div>
						{this.renderNextButton()}
					</div>
			  	</div>
			  	</div>
			  	<div className="row">
				  	<div className="col-sm-12">
						{this.renderExplanations()}
				  	</div>
			  	</div>
			</div>
			);
	}

});

module.exports=LevelView;