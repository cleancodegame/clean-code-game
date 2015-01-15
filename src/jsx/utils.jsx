'use strict';

module.exports.animate = function(comp, effect){
    if (!comp) return;
    var $el = $(comp.getDOMNode());
    $el.addClass("animated-fast " + effect);
    $el.one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
        function(){$el.removeClass("animated " + effect)}
    );
};

module.exports.escapeRe = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};