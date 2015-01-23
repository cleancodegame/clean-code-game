var CodeView = require("./CodeView");
var CodeSample = require("./CodeSample");
var HoverButton = require("./HoverButton");
var MessageButton = require("./MessageButton");

var utils = require("./utils");
var animate = utils.animate;
var tracker = require("./Tracker");

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
		var miss = this.props.level.name + "." + word;
		if (!this.trackedMisses[miss]){
			tracker.missed(this.props.level, word);
			this.trackedMisses[miss] = true;
			this.reduceScore();
		}
	},

	handleFix: function(bug){
		var explanations = _.union(this.state.explanations, [bug.description]);
		var newHints = _.filter(this.state.availableHints, function(h) { return h.name != bug.name });
		this.getModel().fixBug(bug);
		this.setState({
			availableHints: newHints,
			explanations: explanations
		});
	},

	reduceScore: function(){
		this.getModel().missClick();
	},

	handleClick: function(line, ch, word, $target){
		if (this.finished()) return;
		var bug = this.props.level.findBug(line, ch);
		if (bug != null){
			this.handleFix(bug);
		}
		else {
			utils.animate$($target, "shake", function(){
				this.handleMiss(line, ch, word);
			}.bind(this));
		}
	},

	componentDidMount: function() {
		this.trackedMisses = {};
		utils.animate(this.refs.round, "fadeInRight");
	},

	handleUseHint: function(){
		tracker.hintUsed(this.props.level, this.state.availableHints[0]);
		this.getModel().useHint();
		this.setState({
			availableHints: this.state.availableHints.slice(1),
		});
	},

	handleNext: function(){
		utils.animate(this.refs.round, "fadeOutLeft");
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
		if (this.props.prevScore < this.props.score) classes += " animated flipInX";
		return <button ref="nextButton" key={this.props.levelIndex}
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
		var classes = this.props.prevScore < this.props.score ? "animated bounce" : "";
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
					{
						_.map(
							this.props.level.instruction.split('\n'), 
							function(text, i){return <div key={"instruction-" + i}>{text}</div>})
					}
					<div className="code-container">
						<span className="code-toolbar">
							<HoverButton 
								text="сравнить" 
								enabled={hasProgress}
								onEnter={this.showOriginalCode}
								onLeave={this.showCurrentCode} />
							<MessageButton 
								title="подсказка" disabledTitle="нет подсказок" 
								enabled={this.getHint()!==undefined} 
								message={this.getHint()} 
								onClick={this.handleUseHint}/>
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
						{ this.props.prevScore > this.props.score
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
		this.setState({ showOriginal: true });
	},

	showCurrentCode: function() {
		this.setState({ showOriginal: false });
	},
});

module.exports=LevelView;