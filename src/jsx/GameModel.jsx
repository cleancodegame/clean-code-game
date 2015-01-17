var CodeSample = require("./CodeSample");

var GameModel = Backbone.Model.extend({
	level: function(index) {
		index = index !== undefined  ? index : this.get('levelIndex');
		if (index >= this.get('levels').length)
			throw new Error("Invalid level " + index);
		return new CodeSample(this.get('levels')[index]);
	},
})

module.exports = GameModel;