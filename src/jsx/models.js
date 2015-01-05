'use strict';

var _ = require("lodash");

var CodeSample = function(data){
	var me = this;
	this.code = data.code.replace('\r', '');
	this.bugs = data.bugs;
	this.bugsCount = _.keys(this.bugs).length;

	parseCode();

	function parseCode(code){
		_.each(_.values(me.bugs), function(bug){bug.offsets = []});
		_.each(_.keys(me.bugs), function(bugName){me.bugs[bugName].name = bugName});
		var resultOffset = 0;
		me.text = me.code
			.replace(/{{([\s\S]*?)}}/gm, function(sub, p, offset, s){
				var start = offset - resultOffset;
				resultOffset += 4;
				addBugPosition(p, start, p.length);
				return p;
			});
		addBugLinePositions();
	}

	function addBugPosition(token, start, len){
		var name = token;
		var bug = me.bugs[name];
		bug.offsets.push({startIndex: start, len: len});
	}

	function addBugLinePositions(){
		var eols = [-1];
		for (var i = 0; i < me.text.length; i++) {
			if (me.text[i] == '\n')
				eols.push(i);
		}
		eols.push(1000000000);
		_.each(_.values(me.bugs), function(bug){
			bug.offsets.forEach(function(off){
				off.start = getPos(off.startIndex, eols);
				off.end = getPos(off.startIndex + off.len - 1, eols);
			});
		});
	}

	function getPos(pos, eols){
		for(var line=0; line < eols.length; line++)
			if (eols[line] >= pos){
				return  { 
					line: line-1,
					ch:  pos - eols[line-1] - 1
				};
			}
		return null;
	}

	function containPos(offset, line, ch){
		return (offset.start.line < line || (offset.start.line == line && offset.start.ch <= ch+1))
			&& (offset.end.line > line || (offset.end.line == line && offset.end.ch >= ch-1))

	}

	this.findBug = function(line, ch){ //return Bug
		for(var bugName in me.bugs) {
			var bug = me.bugs[bugName];
			var offsets = bug.offsets.filter(function(off){return containPos(off, line, ch);});
			if (offsets.length != 0) return bug;
		}
		return null;
	};

	this.fix = function(bug){ //return CodeSample
		var code2 = this.code.replace(new RegExp("{{" + bug.name + "}}", "gm"), bug.replace);
		var bugs2 = _.cloneDeep(this.bugs);
		delete bugs2[bug.name];
		return new CodeSample({ code: code2, bugs: bugs2 });
	}
};

module.exports.CodeSample = CodeSample;
