module.exports =  React.createClass({
	propTypes: {
		text: React.PropTypes.string.isRequired,
		enabled: React.PropTypes.bool.isRequired,
		onEnter: React.PropTypes.func.isRequired,
		onLeave: React.PropTypes.func.isRequired
	},

	render: function() {
		if (this.props.enabled)
			return <span className="tb-item"
				onMouseEnter={this.props.onEnter} 
				onTouchStart={this.props.onEnter} 
				onMouseLeave={this.props.onLeave} 
				onTouchEnd={this.props.onLeave}>{this.props.text}</span>
		else
			return <span className="tb-item disabled">{this.props.text}</span>
	},
});

