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

test('expands computed, empty entity', () => {
  const html = `before
<div id="section-computed-Entity_1"/>
after`
  const sectionCode = 'Entity_1'
  const meta = {
    sections: {
      'Entity_1': { name: 'Entity 1', type: 'entity' }
    },
    references: {},
    backReferences: {},
    entityAttributes: {}
  }

  const expanded = `before
<div id="section-computed-Entity_1">
<div id="section-erd-Entity_1">
<div><strong>ERD:</strong></div>
<img src="http://www.plantuml.com/plantuml/svg/SoWkIImgAStDuSh8J4bLICuiIiv9vIhEpimhI2nAp5N8oSnBBQaiI5N8Boh9oEVYIiqhoIofL705K_662jLSjLnS3gbvAI0Z0000"/>
</div>
</div>
after`

  expect(expandComputed(html, sectionCode, meta)).toStrictEqual(expanded)
})

test('expands computed, links with empty entity', () => {
  const html = `before
<div id="section-computed-Entity_1"/>
after`
  const sectionCode = 'Entity_1'
  const meta = {
    sections: {
      'Entity_1': { name: 'Entity 1', type: 'entity' },
      'Entity_2': { name: 'Entity 2', type: 'entity' },
      'Entity_3': { name: 'Entity 3', type: 'entity' }
    },
    references: {
      'Entity_1': [
        'Entity_2'
      ],
      'Entity_3': [
        'Entity_1'
      ]
    },
    backReferences: {
      'Entity_2': ['Entity_1'],
      'Entity_1': ['Entity_3']
    },
    attributeToEntity: {
      'Entity_1.att_12': 'Entity_1',
      'Entity_3.att_31': 'Entity_3'
    },
    entityAttributes: {
      'Entity_1': {
        'att_12': {
          'status': null,
          'dataType': '`#Entity_2`'
        }
      },
      'Entity_3': {
        'att_31': {
          'status': null,
          'dataType': '`#Entity_1`'
        }
      }
    }
  }

  const expanded = `before
<div id="section-computed-Entity_1">
<div id="section-refers-to-Entity_1">
<strong>Refers to:</strong>
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_2" title="Entity 2">Entity 2</a>
</div>
<div id="section-referred-from-Entity_1">
<strong>Referred from:</strong>
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_3" title="Entity 3">Entity 3</a>
</div>
<div id="section-erd-Entity_1">
<div><strong>ERD:</strong></div>
<img src="http://www.plantuml.com/plantuml/svg/JSux2e0m40JGVawn5x28TbOsdYC4NN0n7ubh8UBTHV5NpV2OOffPNTObU0pICtMIEy-OHucJoowGbyYwJamfwv00ZYgwKdk5DRI1oAbQKrBzQ8aTU1T5yVbTgXyQD1pxyy01"/>
</div>
</div>
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
      },
      'Entity_5': {
        'type': 'entity',
        'name': 'Entity 5'
      },
      'Entity_Referred_From_Description': {
        'type': 'entity',
        'name': 'Entity referred from description'
      },
      'Entity_Back_Referred_From_Description': {
        'type': 'entity',
        'name': 'Entity back referred from description'
      }
    },
    references: {
      '/screen/1': ['Entity_2'],
      'Entity_2': ['/screen/2', 'Entity_1', 'Entity_2', 'Entity_3', 'NonExistent', 'Entity_Referred_From_Description'],
      'Entity_3': ['Entity_1', 'Entity_2'],
      'Entity_4': ['Entity_2'],
      'Entity_5': ['Entity_1']
    },
    backReferences: {
      'Entity_2': ['/screen/1', 'Entity_2', 'Entity_3', 'Entity_4', 'Entity_Back_Referred_From_Description'],
      '/screen/2': ['Entity_2'],
      'Entity_1': ['Entity_2', 'Entity_3', 'Entity_5'],
      'Entity_3': ['Entity_2']
    },
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
          'status': 'FK',
          'dataType': '`#Entity_1`'
        },
        'att_27': {
          'status': '1 : n',
          'dataType': '[Entity 2](#Entity_2)'
        },
        'att_28': {
          'status': 'n : 1',
          'dataType': '`#Entity_3`'
        },
        'att_29': {
          'status': null,
          'dataType': '`#NonExistent`'
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
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_3" title="Entity 3">Entity 3</a>,
<a href="#NonExistent" title="NonExistent">NonExistent</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_Referred_From_Description" title="Entity referred from description">Entity referred from description</a>
</div>
<div id="section-referred-from-Entity_2">
<strong>Referred from:</strong>
<i class="fas fa-desktop text-muted"></i>&nbsp;<a href="#/screen/1" title="Screen 1">Screen 1</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_2" title="Entity 2">Entity 2</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_3" title="Entity 3">Entity 3</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_4" title="Entity 4">Entity 4</a>,
<i class="fas fa-database text-muted"></i>&nbsp;<a href="#Entity_Back_Referred_From_Description" title="Entity back referred from description">Entity back referred from description</a>
</div>
<div id="section-erd-Entity_2">
<div><strong>ERD:</strong></div>
<img src="http://www.plantuml.com/plantuml/svg/TP7B3e8m44NtynMpDc71msSCSOCRu-CFJ0DDQCIMb37HWF_kW4fXmQfpU-wTcRIxYeIbnxs0N6KIKsNJGa9rKxeKLjonK5hIgvHeBEK6G6fIzCAaEwu1re0eYAw1pyNiMmQumKoGm2x8Shiznl7V68vfoFJSqLyw6lE8-UKmDCp7XZaRzYF3WWs_1Nq7ExHqg5tBPwc7qPNZxMAQfU_IQvOdevEdgeWV0ju0_PocyJnJzysXdp81mYaGeUUvovtKMVix7m00"/>
</div>
</div>
between 2
<div id="section-computed-Entity_3"/>
after`

  expect(expandComputed(html, sectionCode, meta)).toStrictEqual(expanded)
})
