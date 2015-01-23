var ProgressBar = React.createClass({
	mixins: [Backbone.React.Component.mixin],

	render: function() {
		return <table className="header-progress">
					<tr>
						{
							_.map(_.keys(this.props.levels), function(level, i){
								var classes = "progress-tile" + ((i < this.props.levelIndex) ? " solved" : "");
								return <td key={"level" + i} className={classes} />
							}.bind(this))
						}
					</tr>
				</table>
	},
});

module.exports=ProgressBar;