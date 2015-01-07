var CodeView = React.createClass({
	propTypes: {
		code: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func.isRequired
	},

	getDefaultProps: function() {
		return {
			lineNumbers: "true",
			mode: "text/x-csharp",
			readOnly: "nocursor"
		};
	},

	componentDidMount: function() {
		this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), this.props);
		this.getDOMNode().onmouseup =
			function(){
				var sel = this.editor.doc.sel.ranges[0].head;
				this.props.onClick(sel.line, sel.ch);
			}.bind(this);
	},

    componentDidUpdate: function() {
    	if (this.editor) {
        	this.editor.setValue(this.props.code);
    	}
    },

	render: function() {
		return (
			<div>
				<textarea
					ref='editor'
					defaultValue={this.props.code}
					readOnly='true' />
			</div>);
	}
});

module.exports = CodeView;