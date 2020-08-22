const run = require('../run-common')
const converter = require('../../src/index')

const testsDir = 'test/convert'

run(testsDir, converter.convert)
