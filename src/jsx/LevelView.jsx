var CodeView = require("./CodeView");
var CodeSample = require("./CodeSample");
var utils = require("./utils");
var animate = utils.animate;
var tracker = require("./Tracker");


var HintButton = React.createClass({
	propTypes: {
		text: React.PropTypes.string,
		onUsed: React.PropTypes.func
	},

	handleClick: function(){
		bootbox.alert(this.props.text, this.props.onUsed);
	},

	render: function() {
		if (this.props.text !== undefined)
			return <span className="tb-item" onClick={this.handleClick}>подсказка</span>;
		else 
			return <span className='tb-item disabled'>подсказок нет</span>
	}
});

var HoverButton = React.createClass({
	propTypes: {
		text: React.PropTypes.string.isRequired,
		enabled: React.PropTypes.bool.isRequired,
		onEnter: React.PropTypes.func.isRequired,
		onLeave: React.PropTypes.func.isRequired
	},

	render: function() {
		if (this.props.enabled)
			return <span className="tb-item"
				onMouseEnter={this.props.onEnter} 
				onTouchStart={this.props.onEnter} 
				onMouseLeave={this.props.onLeave} 
				onTouchEnd={this.props.onLeave}>{this.props.text}</span>
		else
			return <span className="tb-item disabled">{this.props.text}</span>
	},
});

var LevelView = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	getInitialState: function() {
		var level = this.getModel().get('level');
		return {
			explanations: [],
			availableHints: _.values(level.bugs),
			showOriginal: false,
			solved: false
		};
	},

	finished: function(){
		return this.props.level.bugsCount == 0;
	},

	handleMiss: function (line, ch, word){
		word = word.trim().substring(0, 20);
		var category = "miss."+this.props.level.name;
		var miss = category + "." + word;
		console.log(miss);
		if (!this.trackedMisses[miss]){
			tracker.missed(this.props.level, miss);
			this.trackedMisses[miss] = true;
			this.reduceScore();
		}
	},

	handleFix: function(bug){
		var explanations = _.union(this.state.explanations, [bug.description]);
		var fixedCode = this.props.level.fix(bug);
		var lastHint = this.state.availableHints[0];
		var newHints = _.filter(this.state.availableHints, function(h) { return h.name != bug.name });
		this.getModel().set({
			score: this.props.score + 1,
			level: fixedCode,
		});
		this.setState({
			deltaScore: +1,
			availableHints: newHints,
			explanations: explanations
		});
	},

	reduceScore: function(){
		this.getModel().missClick();
		this.setState({
			deltaScore: -1
		});
	},

	handleClick: function(line, ch, word){
		if (this.finished()) return;
		var bug = this.props.level.findBug(line, ch);

		if (bug != null){
			this.handleFix(bug);
		}
		else {
			this.handleMiss(line, ch, word);
		}
	},

	componentDidMount: function() {
		this.trackedMisses = {};
		animate(this.refs.round, "fadeInRight");
	},

	handleUseHint: function(){
		tracker.hintUsed(this.props.level, this.state.availableHints[0]);
		this.getModel().useHint();
		this.setState({
			availableHints: this.state.availableHints.slice(1),
			deltaScore: -1
		});
	},

	handleNext: function(){
		animate(this.refs.round, "fadeOutLeft");
		$(this.refs.round.getDOMNode()).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			this.setState({solved: true});
			tracker.levelSolved(this.props.levelIndex);
			this.getModel().finishLevel();
		}.bind(this));		
	},

	renderExplanations: function(){
		if (this.state.explanations.length == 0) return "";
		return <div>
			<h3>Объяснения:</h3>
			<ol>
				{ this.state.explanations.map(function(d, i){ return <li key={i}>{d}</li> }) }
			</ol>
		</div>
	},

	renderNextButton: function(){
		if (!this.finished()) return "";
		var classes = "btn btn-lg btn-primary btn-styled btn-next";
		if (this.state.deltaScore > 0) classes += " animated flipInX";
		return <button ref="nextButton"
				className={classes}
				onClick={this.handleNext}>Дальше</button>
	},

	getHint: function(){
		if (this.state.availableHints.length > 0)
			return this.state.availableHints[0].description;
		else
			return undefined;
	},
	renderBugsCount: function(){
		var classes = this.state.deltaScore > 0 ? "animated bounce" : "";
		var bugsCount = this.props.level.bugsCount;
		return <div className="score">
				Осталось найти: <span key={bugsCount} className={classes}>{bugsCount}</span>
			</div>
	},

	render: function() {
		var code = this.state.showOriginal ? this.props.originalLevel : this.props.level;
		var hasProgress = this.props.level.bugsCount < this.props.originalLevel.bugsCount;
		if (this.state.solved) return null;
		return  (
			<div className="round" ref="round">
			  <div className="row">
				<div className="col-sm-12">
					<h2>Уровень {this.props.levelIndex+1}{this.finished() && ". Пройден!"}</h2>
					<p>Найди и исправь все стилевые ошибки в коде. Кликай мышкой по ошибкам.<br/>
					Каждая найденная ошибка: +1 балл. Каждый промах или подсказка: &ndash;1 балл.</p>
					<div className="code-container">
						<span className="code-toolbar">
							<HoverButton text="сравнить" enabled={hasProgress} onEnter={this.showOriginalCode} onLeave={this.showCurrentCode} />
							<HintButton text={this.getHint()} onUsed={this.handleUseHint}/>
						</span>
						<CodeView code={code.text} onClick={this.handleClick} />
					</div>
				</div>
			  </div>
			  <div>
				{this.renderNextButton()}
				</div>
			  <div className="row">
			  	<div className="col-sm-4">
					<div ref="scoreDiv" className="score">
						<div className="pull-left">
							Общий счёт: 
						</div>
						<div className="pull-left score-value" ref="score">{this.props.score}</div>
						{ this.state.deltaScore < 0
							? <div key={this.props.score} className="pull-left minus-one animated fadeOutDown"> —1</div>
							: null }
						<div className="clearfix" />
					</div>
			  	</div>
			  	<div className="col-sm-5">
					{this.renderBugsCount()}
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

	showOriginalCode: function() {
		this.setState({ showOriginal: true, deltaScore: 0 });
	},

	showCurrentCode: function() {
		this.setState({ showOriginal: false, deltaScore: 0 });
	},
});

module.exports=LevelView;