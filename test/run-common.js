const fs = require('fs')
const chalk = require('chalk')
const Diff = require('diff')

const encoding = 'utf8'

const match = /.*/

const replaceOnError = false
// const replaceOnError = true

let testCount = 0
let errorCount = 0
let skipCount = 0

const errors = []
const originalConsoleError = console.error
console.error = output => errors.push(output)

console.error = originalConsoleError

function processDir (dir, testedFn) {
  const files = fs.readdirSync(dir)
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const isDir = fs.statSync(dir + file).isDirectory()
    if (isDir) {
      processDir(dir + file + '/', testedFn)
    } else if (endsWith(file, '.md')) {
      processFile(testedFn, dir + file)
      testCount++
    }
  }
}

function endsWith (str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}

function processFile (testedFn, markdownFile) {
  const fileBase = markdownFile.substr(0, markdownFile.length - 3)
  if (!match.test(fileBase)) {
    console.log(chalk.inverse(`Skipping non-matching test case ${fileBase}`))
    skipCount++
    return
  }
  console.log(chalk.inverse('Processing test case') + ` ${fileBase}`)
  const markdown = fs.readFileSync(markdownFile, encoding)
  const converted = testedFn(markdown)
  const actualHtml = converted.html
  const actualMeta = JSON.stringify(converted.meta, null, 2)
  const htmlFile = fileBase + '.html'
  const expectedHtml = fs.readFileSync(htmlFile, encoding)
  const metaFile = fileBase + '.meta.json'
  const expectedMeta = fs.existsSync(metaFile) ? fs.readFileSync(metaFile, encoding) : null
  let message
  if (expectedHtml !== actualHtml) {
    if (replaceOnError) {
      message = chalk.redBright(`Assertion failed for test case ${fileBase}. Replacing template content.`)
      console.log(message)
      fs.writeFileSync(htmlFile, actualHtml)
    } else {
      const diff = Diff.diffWords(expectedHtml, actualHtml)
      message = chalk.redBright(`Assertion failed for test case ${fileBase}:\n`)
      diff.forEach(function (part) {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey'
        message += chalk[color](part.value)
      })
      console.log(message)
    }
    errorCount++
  } else if (expectedMeta !== null && expectedMeta !== actualMeta) {
    if (replaceOnError) {
      message = chalk.redBright(`Assertion failed for test case ${fileBase}. Replacing meta content.`)
      console.log(message)
      fs.writeFileSync(metaFile, actualMeta)
    } else {
      const diff = Diff.diffWords(expectedMeta, actualMeta)
      message = chalk.redBright(`Assertion failed for test case ${fileBase}:\n`)
      diff.forEach(function (part) {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey'
        message += chalk[color](part.value)
      })
      console.log(message)
    }
    errorCount++
  }
}

function run (testsDir, testedFn) {
  processDir(testsDir + '/', testedFn)

  let result = chalk.inverse(`Tests run: ${testCount}`)
  if (skipCount !== 0) {
    result += `, skipped: ${skipCount}`
  }
  if (errorCount !== 0) {
    result += ', ' + chalk.bgRedBright(`errors: ${errorCount}`)
  }
  const passCount = testCount - errorCount - skipCount
  if (passCount !== 0) {
    result += ', ' + chalk.bgGreenBright(`passed: ${passCount}`)
  }
  console.log(result)
}

module.exports = run
