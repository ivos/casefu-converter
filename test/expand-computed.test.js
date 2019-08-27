const expect = require('expect')
const test = window.test

const expandComputed = require('../src/expand-computed')

test('expands computed, full', () => {
  const html = `before
<div id="section-computed-sec/1"/>
between 1
<div id="section-computed-sec/2"/>
between 2
<div id="section-computed-sec/3"/>
after`
  const sectionCode = 'sec/2'
  const meta = {
    sections: {
      'sec/1': { name: 'Sec 1' },
      'sec/2': { name: 'Sec 2' },
      'sec/3': { name: 'Sec 3' },
      'sec/5': { name: 'Sec 5' },
      'sec/7': { name: 'Sec 7' }
    },
    references: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/1', 'sec/3', 'sec/5'],
      'sec/3': ['sec/4']
    },
    backReferences: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/3', 'sec/5', 'sec/7'],
      'sec/3': ['sec/4']
    }
  }

  const expanded = `before
<div id="section-computed-sec/1"/>
between 1
<div id="section-computed-sec/2">
<div id="section-refers-to-sec/2">
<strong>Refers to:</strong> <a href="#sec/1">Sec 1</a>, <a href="#sec/3">Sec 3</a>, <a href="#sec/5">Sec 5</a>
</div>
<div id="section-referred-from-sec/2">
<strong>Referred from:</strong> <a href="#sec/3">Sec 3</a>, <a href="#sec/5">Sec 5</a>, <a href="#sec/7">Sec 7</a>
</div>
</div>
between 2
<div id="section-computed-sec/3"/>
after`

  expect(expandComputed(html, sectionCode, meta)).toStrictEqual(expanded)
})

test('expands computed, empty', () => {
  const html = `before
<div id="section-computed-sec/1"/>
between 1
<div id="section-computed-sec/2"/>
between 2
<div id="section-computed-sec/3"/>
after`
  const sectionCode = 'sec/2'
  const meta = {
    sections: {
      'sec/1': { name: 'Sec 1' },
      'sec/2': { name: 'Sec 2' },
      'sec/3': { name: 'Sec 3' }
    },
    references: {
      'sec/1': ['sec/2'],
      'sec/3': ['sec/4']
    },
    backReferences: {
      'sec/1': ['sec/2'],
      'sec/3': ['sec/4']
    }
  }

  const expanded = `before
<div id="section-computed-sec/1"/>
between 1
<div id="section-computed-sec/2">
</div>
between 2
<div id="section-computed-sec/3"/>
after`

  expect(expandComputed(html, sectionCode, meta)).toStrictEqual(expanded)
})
