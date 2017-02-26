import _ from "lodash"

export default class CodeSample {
	constructor(level) {
		this.name = level.name;
		this.code = level.code
		this.bugs = level.bugs
		this.instruction = level.instruction
		this.learning = level.learning
		this.packageId = level.packageId
		this.bugsCount = Object.keys(this.bugs).length

    this.text = this.parseCode()
    this.addBugLinePositions()
	}

	parseCode = () => {
		_.each(_.values(this.bugs), function (bug) {
			bug.offsets = []
		});
		_.each(_.keys(this.bugs), (bugName) => {
			this.bugs[bugName].name = bugName
		});

		var resultOffset = 0;

    return this.code
			.replace(/{{([\s\S]*?)}}/gm, function (sub, p, offset, s) {
				var start = offset - resultOffset;

				resultOffset += 4;
				this.addBugPosition(p, start, p.length);

				return p;
			})
	}

	addBugPosition = (token, start, len) => {
		var name = token.trim().split(' ', 2)[0];
		var bug = this.bugs[name];

    if (bug === undefined) {
			console.log(this.bugs);
			throw new Error("In code " + data.name + " unknown bug " + name);
		}

		bug.content = token;
		bug.offsets.push({
			startIndex: start,
			len: len
		});
	}

	addBugLinePositions = () => {
		var eols = [-1];

		for (var i = 0; i < this.text.length; i++) {
			if (this.text[i] === '\n')
				eols.push(i);
		}
		eols.push(1000000000);

		_.each(_.values(this.bugs), function (bug) {
			bug.offsets.forEach(function (offset) {
				offset.start = getPos(offset.startIndex, eols);
				offset.end = getPos(offset.startIndex + offset.len - 1, eols);
			});
		});
	}

	function getPos(pos, eols) {
		for (var line = 0; line < eols.length; line++)
			if (eols[line] >= pos) {
				return {
					line: line - 1,
					ch: pos - eols[line - 1] - 1
				};
			}
	}

	function containPos(offset, line, ch) {
		return (offset.start.line < line || (offset.start.line === line && offset.start.ch <= ch + 1))
      && (offset.end.line > line || (offset.end.line === line && offset.end.ch >= ch - 1))
	}

	findBug = (line, ch) => { //return Bug
		for (let bug of this.bugs)) {
			var offsets = bug.offsets.filter(offset => containPos(offset, line, ch))

			if (offsets.length !== 0)
        return bug
		}
	}

	function escapeRe(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	fix = (bug) => {
		var code2 = this.code.replace(new RegExp("\\{\\{" + escapeRe(bug.content) + "\\}\\}", "gm"), bug.replace);
		var bugs2 = _.cloneDeep(this.bugs);

    delete bugs2[bug.name];

    return new CodeSample({
			name: this.name,
			code: code2,
			bugs: bugs2,
      packageId: this.packageId,
			instruction: this.instruction,
			learning: this.learning
		})
	}
}
