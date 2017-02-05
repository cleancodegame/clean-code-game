import React from 'react';
import MessageButton from './MessageButton'
import CodeView from './CodeView'
import _ from 'lodash';
import "animate.css";
import classes from 'classnames'

class LevelView extends React.Component {
	static propTypes = {
		game: React.PropTypes.object.isRequired,
		onBugFix: React.PropTypes.func.isRequired,
		onMiss: React.PropTypes.func.isRequired,
		onUseHint: React.PropTypes.func.isRequired,
		onNext: React.PropTypes.func.isRequired
	}

	isFinished() {
		console.log(this.props.game)
		return this.props.game.currentLevel.bugsCount() === 0;
	}
	handleClick = (line, ch, word) => {
		if (this.isFinished()) return;
		var bug = this.props.game.currentLevel.findBug(line, ch);
		if (bug != null) {
			this.props.onBugFix(bug);
		}
		else {
			word = word.trim().substring(0, 20);
			if (!this.props.game.misses.includes(word))
				this.props.onMiss(word);
		}
	}

	renderExplanations() {
		if (this.props.game.foundBugs.length === 0) return "";
		return <div>
			<h3>Объяснения:</h3>
			<ol>
				{this.props.game.foundBugs.map((bug, i) => <li key={i}>{bug.description}</li>)}
			</ol>
		</div>
	}

	renderNextButton() {
		if (!this.isFinished()) return "";
		return <button ref="nextButton" key={this.props.levelIndex}
			className="btn btn-lg btn-primary btn-styled btn-next animated flipInX"
			onClick={this.props.onNext}>Дальше</button>
	}

	getHint() {
		if (this.props.game.availableHints.length > 0) {
			let bugId = this.props.game.availableHints[0];
			return this.props.game.currentLevel.bugs[bugId].description;
		}
		else
			return undefined;
	}
	renderBugsCount() {
		var classes = this.props.game.lastAction === "RIGHT" ? "animated rubberBand" : "";
		var bugsCount = this.props.game.currentLevel.bugsCount();
		return <div className="score">
			Осталось найти: <span style={{display:'inline-block'}} key={bugsCount} className={classes}>{bugsCount}</span>
		</div>
	}

	render() {
		var code = this.props.game.currentLevel;
		return (
			<div className="round" ref="round">
				<div className="row">
					<div className="col-sm-12">
						<h2>Уровень {this.props.game.currentLevelIndex + 1}{this.isFinished() && ". Пройден!"}</h2>
						{
							_.map(
								code.instruction.split('\n'),
								function (text, i) { return <div key={"instruction-" + i}>{text}</div> })
						}
						<div className="code-container">
							<span className="code-toolbar">
								<MessageButton
									buttonTitle="подсказка" buttonDisabledTitle="нет подсказок"
									enabled={this.getHint() !== undefined}
									text={this.getHint()}
									modalTitle="Подсказка"
									onClick={e => this.props.onUseHint(this.props.game.availableHints[0])} />
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
							<div className="pull-left score-value" ref="score">{this.props.game.totalScore}</div>
							{this.props.game.lastAction === "WRONG"
								? <div key={this.props.game.misses.length} className="pull-left minus-one animated fadeOutDown"> Нет!</div>
								: null}
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
	}
}

export default LevelView;
