const run = require('../run-common')
const converter = require('../../src/index')

const testsDir = 'test/it-web-try'

run(testsDir, converter.convertString)
