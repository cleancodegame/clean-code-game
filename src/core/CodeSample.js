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
    this.addBugLinePositions()
	}

	parseCode = () => {
		let resultOffset = 0

    Object.keys(this.bugs).forEach(bugKey => {
      this.bugs[bugKey].offsets = []
    })

    return this.code
			.replace(/({{(\d+)}})/gm, (sub, fullFind, key, offset) => {
        const bug = this.bugs[key]

        if (bug === undefined) {
    			throw new Error("In code " + this.name + " unknown bug key " + key)
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
		const eols = [-1]

		for (let i = 0; i < this.text.length; i++) {
			if (this.text[i] === '\n') {
				eols.push(i)
      }
		}

		eols.push(Infinity)

		Object.keys(this.bugs).forEach(key => {
			this.bugs[key].offsets.forEach(offset => {
				offset.start = this.getPos(offset.startIndex, eols)
				offset.end = this.getPos(offset.startIndex + offset.len - 1, eols)
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

	getBugDifference = bugKey => {
		const { code: bugCode, replace: replaceCode } = this.bugs[bugKey]

		const bugLines = bugCode.split('\n')
		const replaceLines = replaceCode.split('\n')

		let type = bugLines.length === 1 ? 'increase' : 'reduce'

		if ((bugLines.length === 1 && replaceLines.length === 1) ||
				(bugLines.length > 1 && replaceLines.length > 1)) {
			type = 'multiple'
		}

		return {
			lineDifference: bugLines.length - replaceLines.length,
			characterDifference:
				bugLines[bugLines.length - 1].length - replaceLines[replaceLines.length - 1].length,
			type,
		}
	}

	getBugOffsets = bugKey => {
		const bugDifference = this.getBugDifference(bugKey)
		const bugOffsets = this.bugs[bugKey].offsets.map(({ start, end }) => {
			const startLineCharacter = countCharacter(bugDifference.type, start.ch)

			 return {
				 startLine: start.line,
				 startCharacter: start.ch,
				 endLine: end.line,
				 endCharacter: end.ch,
				 lineDifference: bugDifference.lineDifference,
				 characterDifference: bugDifference.characterDifference - startLineCharacter,
			 }
		})

		return mergeBugOffsets(bugOffsets)
	}

	fix = bugKey => {
		const code = this.code.split(`{{${bugKey}}}`).join(this.bugs[bugKey].replace)

    const bugsClone = _.omit(this.bugs, bugKey)

    return new CodeSample({
			name: this.name,
			code,
			bugs: bugsClone,
      packageId: this.packageId,
			instruction: this.instruction,
			learning: this.learning,
			bugOffsets: this.getBugOffsets(bugKey),
		})
	}
}

function countCharacter(type, count) {
	switch(type) {
		case 'increase':
			return -count
		case 'reduce':
			return count
		default:
			return 0
	}
}

function mergeBugOffsets(offsets) {
  let previous

	return offsets.map(offset => {
		if (!previous) {
			previous = offset

      return offset
		}

    const changedOffset = { ...offset }

		if (previous.lineDifference > 0) {
      changedOffset.lineDifference = offset.lineDifference + previous.lineDifference
		}

		if (offset.startLine === previous.startLine
			  && offset.endCharacter > previous.startCharacter) {
      changedOffset.characterDifference = offset.characterDifference + previous.characterDifference
		}

    previous = offset

    return changedOffset
	})
}

function containPos(offset, line, ch) {
  return (offset.start.line < line || (offset.start.line === line && offset.start.ch <= ch + 1))
    && (offset.end.line > line || (offset.end.line === line && offset.end.ch >= ch - 1))
}
