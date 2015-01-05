'use strict';

var models = require("./models.js");
var views = require("./views.js");
var Round = views.Round;
var Results = views.Results;

var Game = function(data, totalScore)
{
  var me = this;
  this.totalScore = totalScore;

  this.startGame = function() {
    me.score = 0;
    me.codeSample = new models.CodeSample(data[0]);
    me.showNextRound();
  }

  this.showNextRound = function(){
    React.render(
      <Round
        onNext={this.handleNext}
        codeSample={this.codeSample}
        />,
      document.getElementById("game"));
  };

  this.showFinalStats = function(){
    var judge = function(rate){
      console.log("rate: " + rate);
      if (rate == 1) return "excellent";
      if (rate > 0.8) return "good";
      if (rate > 0) return "bad";
      return "awful";
    };
    React.render(
      <Results
        score={this.score}
        totalScore={this.totalScore}
        judge={judge(this.score / this.totalScore)}
        onRepeat={this.startGame} />,
      document.getElementById("main"));
  };

  this.handleNext = function(solved){
    console.log("next");
  }
  this.startGame();
};

function runGame(){
  console.log("runGame");
  $.getJSON( "data/data.json", function( data ) {
    var game = new Game(data);
  });
}

runGame();