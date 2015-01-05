'use strict';

var models = require("./models.js");
var views = require("./views.js");
var Round = views.Round;
var Results = views.Results;

var Game = function(data)
{
  var me = this;

  this.runNextRound = function() {
    me.codeSample = new models.CodeSample(data[++me.currentLevel]);
    me.showNextRound();
  }

  this.showNextRound = function(){
    $("#game").empty();
    React.render(
      <Round
        codeSample={this.codeSample}
        onNext={this.handleNext}
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
        onRepeat={this.restart} />,
      document.getElementById("main"));
  };

  this.restart = function(){
    me.currentLevel = -1;
    me.score = 0;
    me.runNextRound();

  }

  this.handleNext = function(){
    console.log("next in game");
    me.runNextRound();
  }

  this.restart();
};

function runGame(){
  console.log("runGame");
  $.getJSON( "data/data.json", function( data ) {
    var game = new Game(data);
  });
}

runGame();