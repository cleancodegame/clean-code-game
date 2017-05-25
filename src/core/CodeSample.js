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

	fix = (bugKey) => {
		const code = this.code.split(`{{${bugKey}}}`).join(this.bugs[bugKey].replace)

		const bugDifference = this.getBugDifference(bugKey)
		const curentBugOffsets = this.bugs[bugKey].offsets.map(({ start, end }) => {
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

		const dependentBugOffset = mergeBugOffsets(curentBugOffsets)

    const bugsClone = _.omit(this.bugs, bugKey)

    return new CodeSample({
			name: this.name,
			code,
			bugs: bugsClone,
      packageId: this.packageId,
			instruction: this.instruction,
			learning: this.learning,
			bugOffsets: mergeWithOldBugOffsets(this.bugOffsets, dependentBugOffset)
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

	for (let offset of offsets) {
		if (!previous) {
			previous = offset
			continue
		}
		if (previous.lineDifference > 0) {
			offset.lineDifference += previous.lineDifference
		}

		if (offset.startLine === previous.startLine
			&& offset.endCharacter > previous.startCharacter) {
				offset.characterDifference += previous.characterDifference
		}
	}
}

function getOffsetIterator(offsets) {
	let key = -1

	return {
		isEnd: () => key === offsets.length - 1,
		next: () => {
			key++
			return offsets[key]
		},
	}
}


function sortOffset(a, b) {
	// debugger
	const offsets = []

	const bItterator = getOffsetIterator(b)

// debugger
	for (let keyA = 0; keyA < a.length;) {
		const offsetA = a[keyA]

		if (bItterator.isEnd()) {
			offsets.push({ o: offsetA, type: 'a'})
			keyA++
			continue
		}

		const offsetB = bItterator.next()
		const lineA = offsetA.startLine + offsetA.lineDifference

		if (lineA < offsetB.startLine) {
			offsets.push({ o: offsetA, type: 'a'})
			keyA++
		} else if (lineA > offsetB.startLine) {
			offsets.push({ o: offsetB, type: 'b'})
		} else {
			const chA = offsetA.startCharacter + offsetA.characterDifference

			if (chA < offsetB.startCharacter) {
				offsets.push({ o: offsetA, type: 'a'})
				keyA++
			} else {
				offsets.push({ o: offsetB, type: 'b'})
			}
		}
	}

	while (!bItterator.isEnd()) {
		offsets.push({ o: bItterator.next(), type: 'b'})
	}

	return offsets
}

// TODO Refactor this
function mergeWithOldBugOffsets(oldOffsets, newOffsets) {
	if (oldOffsets.length === 0) {
		return newOffsets
	}
debugger
	const offsets = sortOffset(oldOffsets, newOffsets)
	let previous = offsets[0]
	const diff = {
		a: { line: 0, ch: 0 },
		b: { line: 0, ch: 0 },
	}

	offsets.forEach(offset => {
		if (offset === previous) {
			return
		}

		debugger


		const { o: nextOffset, type } = offset
		const nextChDiff = type === 'a' ? nextOffset.characterDifference : 0
		const nextCh = nextOffset.startCharacter + nextChDiff

		const nextLineDiff = type === 'a' ? nextOffset.lineDifference : 0
		const nextLine = nextOffset.endLine + nextLineDiff

		const preCountLine = previous.o.endLine - previous.o.startLine
		const nextCountLine = nextOffset.endLine - nextOffset.startLine

		if (previous.type === 'a' && type === 'b') {
			if (previous.o.endLine !== nextOffset.startLine) {
				diff.b.ch = 0
				previous = offset
				return
			}

			diff.b.ch += previous.o.characterDifference

			nextOffset.characterDifference += diff.b.ch
			previous = offset
		}

		if (previous.type === 'b' && type === 'a') {
			if (previous.o.endLine !== nextOffset.startLine) {
				diff.a.ch = 0
				previous = offset
				return
			}

			diff.a.ch += nextOffset.characterDifference
			nextOffset.characterDifference += diff.a.ch
			previous = offset
		}

		if (previous.type === 'a' && type === 'a') {
			if (previous.o.endLine !== nextOffset.startLine) {
				diff.a.ch = 0
				previous = offset
				return
			}

			nextOffset.characterDifference += diff.a.ch
			previous = offset
		}

		if (previous.type === 'b' && type === 'b') {
			if (previous.o.endLine !== nextOffset.startLine) {
				diff.b.ch = 0
				previous = offset
				return
			}

			nextOffset.characterDifference += diff.b.ch
			previous = offset
		}
	})

	return offsets.map(offset => offset.o)
}

function containPos(offset, line, ch) {
  return (offset.start.line < line || (offset.start.line === line && offset.start.ch <= ch + 1))
    && (offset.end.line > line || (offset.end.line === line && offset.end.ch >= ch - 1))
}
