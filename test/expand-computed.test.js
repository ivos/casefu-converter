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
      'sec/1': { type: 'screen', name: 'Sec 1' },
      'sec/2': { type: 'screen', name: 'Sec 2' },
      'sec/3': { type: 'entity', name: 'Sec 3' },
      'sec/5': { type: 'useCase', name: 'Sec 5' },
      'sec/7': { type: 'screen', name: 'Sec 7' }
    },
    references: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/1', 'sec/3', 'sec/rf666', 'sec/5'],
      'sec/3': ['sec/4']
    },
    backReferences: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/3', 'sec/5', 'sec/br666', 'sec/7'],
      'sec/3': ['sec/4']
    }
  }

  const expanded = `before
<div id="section-computed-sec/1"/>
between 1
<div id="section-computed-sec/2">
<div id="section-refers-to-sec/2">
<strong>Refers to:</strong>
<i class="fas fa-desktop text-muted"></i>&nbsp;<a href="#sec/1" title="Sec 1">Sec 1</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#sec/3" title="Sec 3">Sec 3</a>,
<a href="#sec/rf666" title="sec/rf666">sec/rf666</a>,
<i class="fas fa-list-alt text-muted"></i>&nbsp;<a href="#sec/5" title="sec/5 - Sec 5">Sec 5</a>
</div>
<div id="section-referred-from-sec/2">
<strong>Referred from:</strong>
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#sec/3" title="Sec 3">Sec 3</a>,
<i class="fas fa-list-alt text-muted"></i>&nbsp;<a href="#sec/5" title="sec/5 - Sec 5">Sec 5</a>,
<a href="#sec/br666" title="sec/br666">sec/br666</a>,
<i class="fas fa-desktop text-muted"></i>&nbsp;<a href="#sec/7" title="Sec 7">Sec 7</a>
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
