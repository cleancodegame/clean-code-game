import PulsoView from './PulsoView'
import React, { Component } from 'react'
import _ from 'lodash'

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
        <h1>Поздравляем!</h1>
        <p>Теперь ты {this.props.packageName}!</p>
				<p>Твой результат {this.props.totalScore} баллов из {this.props.maxPossibleScore} возможных.</p>
        <div className="PackageResult-buttons">
          {this.renderAgainButton()}
          {this.renderNextButton()}
        </div>
        <p>Поделиться</p>
        {this.renderShareButtons()}
			</div>
		)
	}
}
