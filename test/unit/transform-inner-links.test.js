const chalk = require('chalk')
const expect = require('expect')
const test = window.test
const beforeEach = window.beforeEach
const afterEach = window.afterEach

const transformInnerLinks = require('../../src/transform-inner-links')

let errors = []
const originalConsoleError = console.error
beforeEach(() => {
  errors = []
  console.error = output => errors.push(output)
})

afterEach(() => {
  console.error = originalConsoleError
})

test('passes row with no link', () => {
  const html = `before after`
  const meta = {
    sections: {},
    attributeToEntity: {},
    errors: []
  }

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(html)
  expect(errors).toEqual([])
  expect(meta.errors).toEqual([])
})

test('passes link', () => {
  const html = `before<a href="#sec/1" title="t1">label1</a>after`
  const meta = {
    sections: {
      'sec/1': {}
    },
    attributeToEntity: {},
    errors: []
  }

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(html)
  expect(errors).toEqual([])
  expect(meta.errors).toEqual([])
})

test('reports unknown link', () => {
  const html = `before<a href="#sec/1" title="t1">label1</a>after`
  const meta = {
    sections: {
      'sec/2': {}
    },
    attributeToEntity: {},
    errors: []
  }

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(html)
  expect(errors).toEqual([
    chalk.red('ERROR: Unknown reference to sec/1 in file fileName1')
  ])
  expect(meta.errors).toEqual(['ERROR: Unknown reference to sec/1 in file fileName1'])
})

test('reports multiple unknown links on row', () => {
  const html = `before<a href="#sec/1" title="t1">label1</a>` +
    `between<a href="#sec/2" title="t2">label2</a>` +
    `between<a href="#sec/3" title="t3">label3</a>` +
    `between<a href="#sec/4" title="t4">label4</a>after`
  const meta = {
    sections: {
      'sec/2': {}
    },
    attributeToEntity: {},
    errors: []
  }

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(html)
  expect(errors).toEqual([
    chalk.red('ERROR: Unknown reference to sec/1 in file fileName1'),
    chalk.red('ERROR: Unknown reference to sec/3 in file fileName1'),
    chalk.red('ERROR: Unknown reference to sec/4 in file fileName1')
  ])
  expect(meta.errors).toEqual([
    'ERROR: Unknown reference to sec/1 in file fileName1',
    'ERROR: Unknown reference to sec/3 in file fileName1',
    'ERROR: Unknown reference to sec/4 in file fileName1'
  ])
})

test('transforms attribute link', () => {
  const html = `before<a href="#EntityB.att2" title="t1">label1</a>after`
  const meta = {
    sections: {
      'EntityA': {},
      'EntityB': {},
      'EntityC': {}
    },
    attributeToEntity: {
      'EntityA.att1': 'EntityA',
      'EntityB.att2': 'EntityB',
      'EntityC.att3': 'EntityC'
    },
    errors: []
  }
  const expected = `before<a href="#EntityB" title="t1">label1</a>after`

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(expected)
  expect(errors).toEqual([])
  expect(meta.errors).toEqual([])
})

test('transforms multiple attribute links', () => {
  const html = `before<a href="#EntityB.att2" title="t1">label1</a>` +
    `between<a href="#EntityB.att2" title="t2">label2</a>` +
    `between<a href="#EntityC.att3" title="t3">label3</a>` +
    `between<a href="#EntityA.a1" title="t4">label4</a>` +
    `between<a href="#EntityA.a3" title="t5">label5</a>` +
    `between<a href="#EntityB.att2" title="t6">label6</a>after`
  const meta = {
    sections: {
      'EntityA': {},
      'EntityB': {},
      'EntityC': {}
    },
    attributeToEntity: {
      'EntityA.a1': 'EntityA',
      'EntityA.a2': 'EntityA',
      'EntityA.a3': 'EntityA',
      'EntityB.att2': 'EntityB',
      'EntityC.att3': 'EntityC'
    },
    errors: []
  }
  const expected = `before<a href="#EntityB" title="t1">label1</a>` +
    `between<a href="#EntityB" title="t2">label2</a>` +
    `between<a href="#EntityC" title="t3">label3</a>` +
    `between<a href="#EntityA" title="t4">label4</a>` +
    `between<a href="#EntityA" title="t5">label5</a>` +
    `between<a href="#EntityB" title="t6">label6</a>after`

  expect(transformInnerLinks('fileName1', html, meta)).toStrictEqual(expected)
  expect(errors).toEqual([])
  expect(meta.errors).toEqual([])
})
