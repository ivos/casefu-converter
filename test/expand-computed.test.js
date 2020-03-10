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
      'EntityA': { type: 'entity', name: 'Entity A' },
      'sec/5': { type: 'useCase', name: 'Sec 5' },
      'sec/7': { type: 'screen', name: 'Sec 7' }
    },
    references: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/1', 'sec/3', 'sec/rf666', 'EntityA.att2', 'sec/5'],
      'sec/3': ['sec/4']
    },
    backReferences: {
      'sec/1': ['sec/2'],
      'sec/2': ['sec/3', 'sec/5', 'sec/br666', 'sec/7'],
      'sec/3': ['sec/4']
    },
    attributeToEntity: {
      'EntityA.att1': 'EntityA',
      'EntityA.att2': 'EntityA',
      'EntityA.att3': 'EntityA'
    },
    entityAttributes: {}
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
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#EntityA" title="Entity A">EntityA.att2</a>,
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
    },
    entityAttributes: {}
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

test('expands computed, ERD', () => {
  const html = `before
<div id="section-computed-Entity_1"/>
between 1
<div id="section-computed-Entity_2"/>
between 2
<div id="section-computed-Entity_3"/>
after`
  const sectionCode = 'Entity_2'
  const meta = {
    sections: {
      '/screen/1': {
        'type': 'screen',
        'name': 'Screen 1'
      },
      '/screen/2': {
        'type': 'screen',
        'name': 'Screen 2'
      },
      'Entity_1': {
        'type': 'entity',
        'name': 'Entity 1'
      },
      'Entity_2': {
        'type': 'entity',
        'name': 'Entity 2'
      },
      'Entity_3': {
        'type': 'entity',
        'name': 'Entity 3'
      },
      'Entity_4': {
        'type': 'entity',
        'name': 'Entity 4'
      }
    },
    references: {
      '/screen/1': [
        'Entity_2'
      ],
      'Entity_2': [
        '/screen/2',
        'Entity_1',
        'Entity_2',
        'Entity_3'
      ],
      'Entity_3': [
        'Entity_1',
        'Entity_2'
      ],
      'Entity_4': [
        'Entity_2'
      ]
    },
    backReferences: {},
    attributeToEntity: {
      'Entity_2.att_21': 'Entity_2',
      'Entity_2.att_22': 'Entity_2',
      'Entity_2.att_23': 'Entity_2',
      'Entity_2.att_24': 'Entity_2',
      'Entity_2.att_25': 'Entity_2',
      'Entity_2.att_26': 'Entity_2',
      'Entity_2.att_27': 'Entity_2',
      'Entity_2.att_28': 'Entity_2',
      'Entity_3.att_31': 'Entity_3',
      'Entity_3.att_32': 'Entity_3',
      'Entity_3.att_33': 'Entity_3',
      'Entity_3.att_34': 'Entity_3',
      'Entity_4.att_41': 'Entity_4'
    },
    entityAttributes: {
      'Entity_2': {
        'att_21': {
          'status': null,
          'dataType': ''
        },
        'att_22': {
          'status': 'M',
          'dataType': 'data type 22'
        },
        'att_23': {
          'status': 'O',
          'dataType': 'data type 23'
        },
        'att_24': {
          'status': 'PK',
          'dataType': 'data type 24'
        },
        'att_25': {
          'status': 'FK',
          'dataType': 'data type 25'
        },
        'att_26': {
          'status': null,
          'dataType': '`#Entity_1`'
        },
        'att_27': {
          'status': null,
          'dataType': '[Entity 2](#Entity_2)'
        },
        'att_28': {
          'status': null,
          'dataType': '`#Entity_3`'
        }
      },
      'Entity_3': {
        'att_31': {
          'status': null,
          'dataType': ''
        },
        'att_32': {
          'status': 'APK',
          'dataType': 'bigint'
        },
        'att_33': {
          'status': 'FK',
          'dataType': '`#Entity_1`'
        },
        'att_34': {
          'status': '1 : n',
          'dataType': '`#Entity_2`'
        }
      },
      'Entity_4': {
        'att_41': {
          'status': null,
          'dataType': '`#Entity_2`'
        }
      }
    }
  }

  const expanded = `before
<div id="section-computed-Entity_1"/>
between 1
<div id="section-computed-Entity_2">
<div id="section-refers-to-Entity_2">
<strong>Refers to:</strong>
<i class="fas fa-desktop text-muted"></i>&nbsp;<a href="#/screen/2" title="Screen 2">Screen 2</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_1" title="Entity 1">Entity 1</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_2" title="Entity 2">Entity 2</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_3" title="Entity 3">Entity 3</a>
</div>
<img src="http://www.plantuml.com/plantuml/img/LOx13e8m44Jl-nLxzaOBQWmXNlH2ZFu1QQ09ZQMGiXw8yT_TL9hAQMVdpMpsF9Foz1eizARJs1hVMWtpqxX9UJMWDKxJCcaSFVKZW7PaQC5B68t0Do0geaPaB7O_AV24dIA5eSXhMTwgAWRbbagczq3NThxbEVD7_Hyeje620zSwtTypNj_BedT8deZUCNaIFl05"/>
</div>
between 2
<div id="section-computed-Entity_3"/>
after`

  expect(expandComputed(html, sectionCode, meta)).toStrictEqual(expanded)
})
