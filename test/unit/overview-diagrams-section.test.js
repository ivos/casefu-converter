const expect = require('expect')
const test = window.test

const buildOverviewDiagramsSection = require('../../src/overview-diagrams-section')

test('overview diagrams, ERD', () => {
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
      'Entity_2.att_25': 'Entity_2',
      'Entity_2.att_26': 'Entity_2',
      'Entity_2.att_27': 'Entity_2',
      'Entity_2.att_28': 'Entity_2',
      'Entity_2.att_29': 'Entity_2',
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

  const expected = `<section id="__overview_diagrams">
<h2><i class="fas fa-database text-muted"></i> ERD</h2>
<ul>

<div id="overview-diagram-erd">
<div><strong>ERD:</strong></div>
<img src="http://www.plantuml.com/plantuml/svg/VP112i8m44NtSufS80jDtHTH3-05GaX6EhH9odIwAArt5rr4CDJLX_V_mF_JJk9OvZX0Hm6L9_O3mjHJ6Xsxg0PAACk8AhDq6G2Ja2pg-X5xKElp1nrhP6hKrEXKepi-a1c3lN6EzeAJPng5SggZP-Vx_tc0KdhRjCvhQRnd62YRTYxCdj4ehR-mnHJUBtu1"/>
</div>
</ul>
</section>
`

  expect(buildOverviewDiagramsSection(meta)).toStrictEqual(expected)
})
