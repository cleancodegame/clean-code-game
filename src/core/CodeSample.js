import _ from "lodash"

export default class CodeSample {
	constructor(level) {
		this.name = level.name
		this.code = level.code
		this.bugs = level.bugs
		this.instruction = level.instruction
		this.learning = level.learning
		this.packageId = level.packageId
		this.bugOffsets = level.bugOffsets || []
		this.bugsCount = Object.keys(this.bugs).length

    this.text = this.parseCode()

		this.eols = [-1]

		for (let i = 0; i < this.text.length; i++) {
			if (this.text[i] === '\n') {
				this.eols.push(i)
      }
		}

		this.eols.push(Infinity)
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
		Object.keys(this.bugs).forEach(key => {
			this.bugs[key].offsets.forEach(offset => {
				offset.start = this.getPos(offset.startIndex)
				offset.end = this.getPos(offset.startIndex + offset.len - 1)
			})
		})
	}

  getPos(pos) {
    for (var line = 0; line < this.eols.length; line++)
      if (this.eols[line] >= pos) {
        return {
          line: line - 1,
          ch: pos - this.eols[line - 1] - 1
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

	getBugDifference = bugKey => {
		const { code: bugCode, replace: replaceCode } = this.bugs[bugKey]

		const bugLines = bugCode.split('\n')
		const replaceLines = replaceCode.split('\n')

		if ((bugLines.length === 1 && replaceLines.length === 1) ||
				(bugLines.length > 1 && replaceLines.length > 1)) {
			return {
				lineDifference: bugLines.length - replaceLines.length,
				characterDifference: bugCode.length - replaceCode.length,
			}
		}

		const type = bugLines.length === 1 ? 'increase' : 'reduce'

		return {
			lineDifference: bugLines.length - replaceLines.length,
			characterDifference:
				bugLines[bugLines.length - 1].length - replaceLines[replaceLines.length - 1].length,
			type,
		}
	}

	fix = (bugKey) => {
		const code = this.code.split(`{{${bugKey}}}`).join(this.bugs[bugKey].replace)

		const bugDifference = this.getBugDifference(bugKey)
		const curentBugOffsets = this.bugs[bugKey].offsets.map(({ start, end }) => {
			let startLineCharacter = 0

			if (bugDifference.type) {
				startLineCharacter = bugDifference.type === 'increase' ? -start.ch : start.ch
			}

			 return {
				 startLine: start.line,
				 startCharacter: start.ch,
				 endLine: end.line,
				 endCharacter: end.ch,
				 lineDifference: bugDifference.lineDifference,
				 characterDifference: bugDifference.characterDifference - startLineCharacter,
			 }
		})

    const bugsClone = _.omit(this.bugs, bugKey)

    return new CodeSample({
			name: this.name,
			code,
			bugs: bugsClone,
      packageId: this.packageId,
			instruction: this.instruction,
			learning: this.learning,
			bugOffsets: mergeBugOffsets(this.bugOffsets, curentBugOffsets)
		})
	}
}

function mergeBugOffsets(oldOffsets, newOffsets) {
	return [...oldOffsets, ...newOffsets]
}

function containPos(offset, line, ch) {
  return (offset.start.line < line || (offset.start.line === line && offset.start.ch <= ch + 1))
    && (offset.end.line > line || (offset.end.line === line && offset.end.ch >= ch - 1))
}
