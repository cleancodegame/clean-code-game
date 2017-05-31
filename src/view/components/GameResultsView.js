import React, { Component } from 'react'
import _ from 'lodash'

import BooksView from './BooksView'
import PulsoView from './PulsoView'

export default class GameResultsView extends Component {
	getScorePercentage() {
		if (this.props.maxPossibleScore <= 0) {
			return 0;
		}

		return Math.round(100 * this.props.totalScore / this.props.maxPossibleScore);
	}

	getMessage() {
		const rate = this.getScorePercentage()

		if (rate > 100) {
			return [
				"Ого! Да перед нами читер!",
				"Поделись этой игрой с коллегами, докажи, что разбираешься в чужом коде лучше них! :D",
			]
		}

		if (rate === 100) {
			return [
				"Ого! Да перед нами профи!",
				"Раздражает неряшливый код коллег? Поделись с ними этой игрой, и их код станет чуточку лучше! ;-)",
			]
		}

		if (rate > 60) {
			return [
				"Неплохо, неплохо. Но можно и лучше!",
				"Поделись этой игрой с коллегами, и их код тоже станет чуточку лучше! ;-)",
			]
		}

		return [
			"Ну, по крайней мере ты добрался до конца!",
			"Поделись этой игрой с коллегами, вдруг они наберут ещё меньше очков! :-D",
		]
	}

	renderAgainButton() {
		return <p><a className="btn btn-lg btn-primary btn-styled" href="#" onClick={this.props.handlePlayAgain}>Ещё разик?</a></p>
	}

	renderScoreboardButton() {
		return <p><a className="btn btn-lg btn-primary btn-styled" href="#" onClick={this.props.handleToScoreboard}>К рейтингу!</a></p>
	}

	renderShareButtons() {
		return (
			<div className="share">
				<PulsoView result={this.getScorePercentage() + "%"} />
			</div>);
	}

	render() {
		const [headerPhrase, sharePhrase] = this.getMessage()
		const title = "Я прошел Clean Code Game с результатом " + this.getScorePercentage() + "%!"

		return (
			<div>
				<h2>{headerPhrase}</h2>
				<p>Ты прошел Clean Code Game с результатом {this.getScorePercentage()}%! ({this.props.totalScore} из {this.props.maxPossibleScore} возможных).</p>
				<p>{sharePhrase}</p>
				<PulsoView title={title} />
				<BooksView />
				{this.renderAgainButton()}
				{this.renderScoreboardButton()}
			</div>
		)
	}
}
