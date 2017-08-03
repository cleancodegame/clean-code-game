var _gaq;

module.exports = {
	levelSolved: function(levelIndex){
		var category = 'level-solved';
		this.track(category, levelIndex);
	},

	hintUsed: function(level, hint){
		const category = "hint." + level.name;
		const hintTruncated = hint.description.substring(0, 20);
		this.track(category, hintTruncated);
	},

	finished: function(score){
		this.track('result', score);
	},

	missed: function(level, miss){
		this.track("miss." + level.name, miss);
	},
	
	track: function(event, value){
		if (value === undefined){
			console.log(['track: ', event]);
			_gaq.push(['_trackEvent', event, event, event]);
		}
		else{
			var ev = event + "." + value;
			console.log(['track: ', ev]);
			_gaq.push(['_trackEvent', event, ev, ev]);
		}
	}
};