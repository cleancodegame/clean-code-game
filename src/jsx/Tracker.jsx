module.exports = {
	levelSolved: function(levelIndex){
		var category = 'level-solved';
		var event = category + '.' + levelIndex;
		_gaq.push(['_trackEvent', category, event, 'level-solved']);
	},

	hintUsed: function(level, hint){
		var category = "hint."+level.name;
		var hint = hint.description.substring(0, 20);
		_gaq.push(['_trackEvent', category, category + "." + hint, category + "." + hint]);
	},

	finished: function(score){
		_gaq.push(['_trackEvent', 'result', 'result.' + score, 'result']);
	},

	missed: function(level, miss){
		var category = "miss." + level.name;
		_gaq.push(['_trackEvent', category, miss, category]);
	}
};