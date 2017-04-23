import _ from "lodash"

export default class CodeSample {
	constructor(level) {
		this.name = level.name
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
		let resultOffset = 0

    return this.code
			.replace(/({{(\d+)}})/gm, (sub, fullFind, key, offset) => {
        const bug = this.bugs[key]

        if (bug === undefined) {
    			throw new Error("In code " + this.name + " unknown bug key " + key)
    		}

        if (!bug.offsets) {
          bug.offsets = []
        }

        bug.offsets.push({
          startIndex: offset - resultOffset,
          len: bug.code.length,
        })

        resultOffset += fullFind.length - bug.code.length

				return bug.code
			})
	}

	addBugLinePositions = () => {
		const eols = [-1];

		for (let i = 0; i < this.text.length; i++) {
			if (this.text[i] === '\n') {
				eols.push(i)
      }
		}

		eols.push(Infinity)

		Object.keys(this.bugs).forEach(key => {
			this.bugs[key].offsets.forEach(offset => {
				offset.start = this.getPos(offset.startIndex, eols);
				offset.end = this.getPos(offset.startIndex + offset.len - 1, eols);
			})
		})
	}

  getPos(pos, eols) {
    for (var line = 0; line < eols.length; line++)
      if (eols[line] >= pos) {
        return {
          line: line - 1,
          ch: pos - eols[line - 1] - 1
        }
      }
  }

	findBugKey = (line, ch) => {
		for (let key of Object.keys(this.bugs)) {
			const offsets = this.bugs[key]
        .offsets.filter(offset => containPos(offset, line, ch))

			if (offsets.length !== 0) {
        return key
      }
		}
	}

	fix = (bugKey) => {
		const code = this.code.split(`{{${bugKey}}}`).join(this.bugs[bugKey].replace)

    const bugsClone = Object.keys(this.bugs)
      .reduce((clone, key) => {
        if (key === bugKey) {
          return clone
        }

        return {...clone, [key]: this.bugs[key]}
      }, {})

    return new CodeSample({
			name: this.name,
			code,
			bugs: bugsClone,
      packageId: this.packageId,
			instruction: this.instruction,
			learning: this.learning
		})
	}
}

function containPos(offset, line, ch) {
  return (offset.start.line < line || (offset.start.line === line && offset.start.ch <= ch + 1))
    && (offset.end.line > line || (offset.end.line === line && offset.end.ch >= ch - 1))
}
