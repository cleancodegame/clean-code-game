const levels = require('./levels')
const fs = require('fs')

let levels0 = 1
let levels1 = 1

const convertedLevels = levels.map(({name, instruction, learning, code, bugs}, i) => {
  const textBugs = getTextBugs(code)
  const nameBugs = textBugs.map(bug => bug.split(' ')[0])

  const convertedCode = textBugs.reduce((newCode, textBug, index) => {
    return newCode.split(`{{${textBug}}}`).join(`{{${index}}}`)
  }, code)

  const convertedBugs = nameBugs.reduce((bugsToReturn, nameBug, index) => {
    bugsToReturn[index] = {
      code: textBugs[index],
      type: bugs[nameBug].type,
      description: bugs[nameBug].description,
      replace: bugs[nameBug].replace,
    }

    return bugsToReturn
  }, {})

  const packageId = learning ? 0 : 1

  let orderKey

  if (learning) {
    orderKey = levels0
    levels0 ++
  } else {
    orderKey = levels1
    levels1 ++
  }

  return {
    name,
    instruction,
    learning,
    packageId,
    orderKey,
    code: convertedCode,
    bugs: convertedBugs,
  }
})


const objectLevels = convertedLevels.reduce((levels, level, index) => {
  return Object.assign({[index]: level}, levels)
}, {})

const jsonLevels = JSON.stringify(objectLevels)

fs.writeFile('convertedLevels.json', jsonLevels)

function getTextBugs(code) {
  const bugs = []

  let start = -1
  for (let i = 0; i < code.length - 1; i++) {
    if (code[i] === '{' && code[i + 1] === '{') {
      i += 2
      start = i
    }

    if (code[i] === '}' && code[i + 1] === '}') {
      const bug = code.slice(start, i)

      if (!bugs.includes(bug)) {
        bugs.push(bug)
      }
      i ++
    }
  }

  return bugs
}
