var BooksView = require("./BooksView");
var tracker = require("./Tracker");

var GameOverView = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	componentDidMount: function() {
		tracker.track("fail_on", this.props.levelIndex);
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

			<button className="btn btn-lg btn-primary btn-styled" onClick={this.handlePlayAgain}>Ещё раз</button>
		</div>;
	},

	handlePlayAgain: function(){
		tracker.track("again_after_fail_on", this.props.levelIndex);
		this.getModel().reset();
	},
});

module.exports = GameOverView;