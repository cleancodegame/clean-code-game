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

	renderAgainButton() {
		return <p
        className="btn btn-lg btn-primary btn-styled"
        onClick={() => this.props.handleStartPackage(this.props.packageId)}>
          Ещё разик?
      </p>
	}
	renderNextButton() {
		return <p
        className="btn btn-lg btn-primary btn-styled"
        onClick={() => this.props.handleStartPackage(this.props.nextPackageId)}>
          Следующий!
      </p>
	}

	renderShareButtons() {
		return (
			<div className="share">
				<PulsoView result={this.getScorePercentage() + "%"} />
			</div>);
	}

	render() {
		return (
			<div>
				<h2>Ты прошел { this.props.packageName} с результатом {this.getScorePercentage()}%! ({this.props.totalScore} из {this.props.maxPossibleScore} возможных).</h2>
        {this.renderNextButton()}
        {this.renderAgainButton()}
        <p>Поделимся?</p>
        {this.renderShareButtons()}
			</div>
		)
	}
}
