var BooksView = require("./BooksView");
var utils = require("./utils");
var tracker = require("./Tracker");

function removeHash () { 
	history.pushState("", document.title, window.location.pathname + window.location.search);
}

var ResultsView = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	propTypes: {
		onPlayAgain: React.PropTypes.func.isRequired
	},

	componentDidMount: function() {
		tracker.finished(this.props.score);
		removeHash();
		utils.initUpToLike();
	},

	getScorePercentage: function(){
		if (this.props.maxScore <= 0) return 0;
		return Math.round(100 * this.props.score / this.props.maxScore);
	},


	render: function() {
		var rate = this.getScorePercentage();
		if (rate == 100) 
			return this.renderVerdict(
				"Ого! Да перед нами профи!", 
				"Раздражает неряшливый код коллег? Поделись с ними этой игрой, и их код станет чуточку лучше! ;-)");
		else if (rate > 60)
			return this.renderVerdict(
				"Неплохо, неплохо. Но можно и лучше", 
				"Поделись этой игрой с коллегами, и их код тоже станет чуточку лучше! ;-)");
		else
			return this.renderVerdict(
				"Ну, по крайней мере ты добрался до конца!", 
				"Поделись этой игрой с коллегами, вдруг они наберут ещё меньше очков! :-D");
	},

	renderVerdict: function(headerPhrase, sharePhrase){
		return (
			<div>
				<h2>{headerPhrase}</h2>
				{this.renderScoreInfo()}
				{this.renderMistakeDetails()}
				{this.renderAgainButton()}
				<BooksView />
				<p>
				{sharePhrase}
				</p>
				{this.renderShareButtons()}
			</div>);
	},

	renderScoreInfo: function(){
		return (
			<p>{this.getScorePercentage()}% очков ({this.props.score} из {this.props.maxScore} возможных).</p>
			);
	},

	renderMistakeDetails: function(){
		var types = _.sortBy(_.keys(this.props.penalty), function(t){return -this.props.penalty[t]}, this);
		console.log(types);
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
		return <p><a href="#" onClick={this.props.onPlayAgain}>Ещё разик?</a></p>
	},

	renderShareButtons: function(){
		return (
			<div className="share">
				<div className="uptolike-container">
					<div data-share-size="40" data-like-text-enable="false" data-background-alpha="0.0" data-pid="1330841" data-mode="share" data-background-color="#ffffff" data-share-shape="rectangle" data-share-counter-size="12" data-icon-color="#ffffff" data-text-color="#000000" data-buttons-color="#ffffff" data-counter-background-color="#ffffff" data-share-counter-type="disable" data-orientation="horizontal" data-following-enable="false" data-sn-ids="fb.vk.tw." data-selection-enable="false" data-exclude-show-more="false" data-share-style="1" data-counter-background-alpha="1.0" data-top-button="false" className="uptolike-buttons" ></div>
				</div>
			</div>);
	},
});

module.exports = ResultsView;