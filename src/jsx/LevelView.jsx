var CodeView = require("./CodeView");
var CodeSample = require("./CodeSample");
var utils = require("./utils");
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
			console.log(42);
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
			if (this.state.score < 0)
				this.handleNext(this.state.score);
		}
	},

	componentDidMount: function() {
		this.trackedMisses = {};
		animate(this.refs.round, "fadeInRight");
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
		animate(this.refs.round, "fadeOutLeft");
		$(this.refs.round.getDOMNode()).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			
			console.log(this.state.score);
			this.props.onNext(this.state.score);
		}.bind(this));		
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
				className="pull-right btn btn-lg btn-primary btn-styled"
				onClick={this.handleNext}>Дальше</button>
	},

	render: function() {
		var code = this.state.showOriginal ? this.props.codeSample : this.state.codeSample; //from props or from state?
		return  (
			<div className="round" ref="round">
			  <div className="row">
				<div className="col-sm-12">
					<h2>Уровень {this.props.level+1}{this.finished() && ". Пройден!"}</h2>
					<p>Найди и исправь все стилевые ошибки в коде. Кликай мышкой по ошибкам!</p>
					<div className="code-container">
						<i className="code-eye glyphicon glyphicon-eye-open" 
							onMouseDown={this.handleMouseDown} 
							onTouchStart={this.handleMouseDown} 
							onMouseUp={this.handleMouseUp} 
							onTouchEnd={this.handleMouseUp}/>
						<CodeView code={code.text} onClick={this.handleClick} />
					</div>
				</div>
			  </div>
			  <div className="row">
			  	<div className="col-sm-3">
					<div className="score">
						Общий счёт: <span className="score-value" ref="score">{this.state.score}</span>
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
	},

	handleMouseDown: function() {
		this.setState({ showOriginal: true });
	},

	handleMouseUp: function() {
		this.setState({ showOriginal: false });
	}

});

module.exports=LevelView;