module.exports = React.createClass({
	propTypes: {
		title: React.PropTypes.string,
		disabledTitle: React.PropTypes.string,
		enabled: React.PropTypes.bool,
		message: React.PropTypes.string,
		onClick: React.PropTypes.func
	},

	handleClick: function(){
		bootbox.alert(this.props.message, this.props.onClick);
	},

	render: function() {
		if (this.props.enabled)
			return <span className="tb-item" onClick={this.handleClick}>{this.props.title}</span>;
		else 
			return <span className='tb-item disabled'>{this.props.disabledTitle}</span>
	}
});