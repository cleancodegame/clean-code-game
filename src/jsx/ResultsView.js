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
        $("#uptolikescript").remove();
        s = document.createElement('script');
        s.id="uptolikescript";
        s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
        s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://w.uptolike.com/widgets/v1/uptolike.js';
        document.getElementsByTagName('body')[0].appendChild(s);
	},

	getScorePercentage: function(){
		return Math.round(100 * this.props.score / this.props.maxScore);
	},


	render: function() {
		var rate = this.getScorePercentage();
		if (rate == 100) 
			return this.renderVerdict(
				"Ого! Да перед нами профи!", 
				"Раздражает неряшливый код коллег? Поделись с ними этой игрой, и их код станет чуточку лучше! ;-)");
		else if (rate > 90) 
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
				<div className="pull-right">
					<img src="img/cat.png" />
				</div>
				<h2>{headerPhrase}</h2>
				{this.renderScoreInfo()}
				{this.renderAgainButton()}
				{this.renderBooks()}
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

	renderAgainButton: function(){
		return <p><a href="#" onClick={this.props.onPlayAgain}>Ещё разик?</a></p>
	},

	renderBooks: function(){
		return (
			<div>
				<p>Больше и подробнее про чистый код можно узнать из этих замечательных книг:</p>
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