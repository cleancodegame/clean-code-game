var books = [
	{
		title: 'Чистый код. Роберт Мартин',
		img: 'img/cleancode.jpg',
		url: 'http://www.ozon.ru/context/detail/id/21916535/'
	},
	{
		title: 'Совершенный код. Стив Макконнелл',
		img: 'img/codecomplete.jpg',
		url: 'http://www.ozon.ru/context/detail/id/3159814/'
	}
];

var ResultsView = React.createClass({
	propTypes: {
		score: React.PropTypes.number.isRequired,
		maxScore: React.PropTypes.number.isRequired,
		onPlayAgain: React.PropTypes.func.isRequired
	},

	componentDidMount: function() {
		initUpToLike();
	},

	getScorePercentage: function(){
		return Math.round(100 * this.props.score / this.props.maxScore);
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

	renderScoreInfo: function(){
		return (
			<p>Вы набрали {this.getScorePercentage()}% очков ({this.props.score} из {this.props.maxScore} возможных).</p>
			);
	},

	renderBooks: function(){
		return (
			<div>
				<p>Хотите узнать больше, как писать чистый код? Читайте книги!</p>
				<div className="books">
				{_.map(books, function(b){
					return <div className="book pull-left" key={b.title}>
						<a target="blank" title={b.title} href={b.url}><img src={b.img} alt={b.title}/></a>
					</div>
				})}
					<div className="clearfix"/>
				</div>
			</div>
			);
	},

	renderExcellent: function(scoreComponent){
		return (
			<div>
				{this.renderCat()}
				<h2>Ого! Да вы профи!</h2>
				{this.renderScoreInfo()}
				<p>
				Наверняка, вас раздражает неряшливый код ваших коллег.
				Поделитесь с ними этой игрой, и их код станет чуточку лучше! ;-)
				</p>
				{this.renderShareButtons()}
			</div>);
	},

	renderGood: function(){
		return (
			<div>
				{this.renderCat()}
				<h2>Неплохо, неплохо. Но можно и лучше</h2>
				{this.renderScoreInfo()}
				{this.renderAgainButton()}
				{this.renderBooks()}
				<p>
				Поделитесь этой игрой с вашими коллегами, и их код тоже станет чуточку лучше! ;-)
				</p>
				{this.renderShareButtons()}
			</div>);
	},

	renderPoor: function(){
		return (
			<div>
				{this.renderCat()}
				<h2>Ну, по крайней мере вы добрались до конца!</h2>
				{this.renderScoreInfo()}
				{this.renderAgainButton()}
				{this.renderBooks()}
				<p>
				Поделитесь этой игрой с вашими коллегами, вдруг они наберут ещё меньше очков! :-D
				</p>
				{this.renderShareButtons()}
			</div>);
	},

	renderCat: function(){
		return  <div className="pull-right">
					<img src="img/cat.png" />
				</div>;
	},

	render: function() {
		var rate = this.getScorePercentage();
		if (rate == 100) return this.renderExcellent();
		else if (rate > 90) return this.renderGood();
		return this.renderPoor();
	}
});

module.exports = ResultsView;