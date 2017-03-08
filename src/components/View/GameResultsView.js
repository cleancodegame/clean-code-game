import React from 'react';
import _ from 'lodash';

import BooksView from "./BooksView"
import PulsoView from "./PulsoView";

var GameResultsView = React.createClass({

	getScorePercentage: function(){
		if (this.props.game.maxPossibleScore <= 0) return 0;
		return Math.round(100 * this.props.game.totalScore / this.props.game.maxPossibleScore);
	},


	render: function() {
		var rate = this.getScorePercentage();
		if (rate > 100)
			return this.renderVerdict(
				"Ого! Да перед нами читер!",
				"Поделись этой игрой с коллегами, докажи, что разбираешься в чужом коде лучше них! :D");
		else if (rate === 100) 
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
				<p>{sharePhrase}</p>

				<PulsoView title={title} />

				<BooksView />
				{this.renderAgainButton()}
			</div>);
	},

	renderScoreInfo: function(){
		return (
			<p>Ты прошел Clean Code Game с результатом {this.getScorePercentage()}%! ({this.props.game.totalScore} из {this.props.game.maxPossibleScore} возможных).</p>
			);
	},

	renderAgainButton: function(){
		return <p><a className="btn btn-lg btn-primary btn-styled" href="#" onClick={this.handlePlayAgain}>Ещё разик?</a></p>
	},

	handlePlayAgain: function(){
		this.props.onPlayAgain();
	},

	renderShareButtons: function(){
		return (
			<div className="share">
				<PulsoView result={this.getScorePercentage() + "%"} />
			</div>);
	},
});

module.exports = GameResultsView;
