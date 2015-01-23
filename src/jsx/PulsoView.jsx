var PulsoView = React.createClass({
	propTypes: {
		title: React.PropTypes.string
	},
	componentDidMount: function() {
		if (window.pluso && typeof window.pluso.start == "function") return;
		if (window.ifpluso==undefined) { 
			window.ifpluso = 1;
			var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
			s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
			s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://share.pluso.ru/pluso-like.js';
			var h=d[g]('body')[0];
			h.appendChild(s);
		}
	},
	render: function() {
		return (
			<div 
				className="pluso"
			 	data-background="#ebebeb" 
			 	data-options="medium,square,line,horizontal,nocounter,theme=04"
			 	data-services="vkontakte,facebook,twitter,google,email"
			 	data-url="http://cleancodegame.github.io/"
			 	data-title={this.props.title}
			 	data-user="73315997" />
		);
	}
});

module.exports = PulsoView;