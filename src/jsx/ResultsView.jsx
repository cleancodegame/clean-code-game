var BooksView = require("./BooksView");
var PulsoView = require("./PulsoView");
var utils = require("./utils");
var tracker = require("./Tracker");

function removeHash () { 
	history.pushState("", document.title, window.location.pathname + window.location.search);
}

var ResultsView = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	componentDidMount: function() {
		tracker.finished(this.props.score);
		removeHash();
	},

	getScorePercentage: function(){
		if (this.props.maxScore <= 0) return 0;
		return Math.round(100 * this.props.score / this.props.maxScore);
	},


	render: function() {
		var rate = this.getScorePercentage();
		if (rate > 100)
			return this.renderVerdict(
				"Ого! Да перед нами читер!",
				"Поделись этой игрой с коллегами, докажи, что разбираешься в чужом коде лучше них! :D");
		else if (rate == 100) 
			return this.renderVerdict(
				"Ого! Да перед нами профи!", 
				"Раздражает неряшливый код коллег? Поделись с ними этой игрой, и их код станет чуточку лучше! ;-)");
		else if (rate > 60)
			return this.renderVerdict(
				"Неплохо, неплохо. Но можно и лучше!", 
				"Поделись этой игрой с коллегами, и их код тоже станет чуточку лучше! ;-)");
		else
			return this.renderVerdict(
				"Ну, по крайней мере ты добрался до конца!", 
				"Поделись этой игрой с коллегами, вдруг они наберут ещё меньше очков! :-D");
	},

	renderVerdict: function(headerPhrase, sharePhrase){
		var title = "Я прошел Clean Code Game с результатом " + this.getScorePercentage() + "%!"
		return (
			<div>
				<h2>{headerPhrase}</h2>
				{this.renderScoreInfo()}

				<PulsoView title={title} />

				{this.renderMistakeDetails()}
				
				<p><BooksView /></p>
				{this.renderAgainButton()}
			</div>);
	},

	renderScoreInfo: function(){
		return (
			<p>Ты прошел Clean Code Game с результатом {this.getScorePercentage()}%! ({this.props.score} из {this.props.maxScore} возможных).</p>
			);
	},

	renderMistakeDetails: function(){
		var types = _.sortBy(_.keys(this.props.penalty), function(t){return -this.props.penalty[t]}, this);
		if (types.length == 0) return "";
		return <div>
				<h3>Статистика ошибок</h3>
				<table className="table">
				{_.map(types, function(t){
					return <tr key={t}>
							<th>{t}</th>
							<td>{this.props.penalty[t]}</td>
						</tr>
				}, this)}
			</table>
			</div>;
	},

	renderAgainButton: function(){
		return <p><a className="btn btn-lg btn-primary btn-styled" href="#" onClick={this.handlePlayAgain}>Ещё разик?</a></p>
	},

	handlePlayAgain: function(){
		tracker.track("again_after_success_with", this.props.score);
		this.getModel().reset();
	},

	renderShareButtons: function(){
		return (
			<div className="share">
				<PulsoView result={this.getScorePercentage() + "%"} />
			</div>);
	},
});

module.exports = ResultsView;
