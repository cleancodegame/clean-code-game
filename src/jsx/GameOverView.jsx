var BooksView = require("./BooksView");

var GameOverView = React.createClass({
	propTypes: {
		onPlayAgain: React.PropTypes.func.isRequired
	},

	render: function() {
		return <div>
			<h2>Вы проиграли!</h2>
			<p>
				Это была плохая новость.
				Хорошая новость — вам есть куда расти!
			</p>
			<BooksView />

			<p>
				Впрочем, возможно, вам просто не повезло. Попробуйте ещё раз!
			</p>

			<button className="btn btn-lg btn-primary btn-styled" onClick={this.props.onPlayAgain}>Ещё раз</button>
		</div>;
	},
});

module.exports = GameOverView;