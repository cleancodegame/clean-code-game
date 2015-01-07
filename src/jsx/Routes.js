var initRoutes = function(game){
	
	function play(levelIndex){
		console.log("play level " + levelIndex);
		game.start(~~levelIndex);
	}

	routie({
	    '': play,
	    'level/:level': play
	});
};


module.exports = initRoutes;