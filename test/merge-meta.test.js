const chalk = require('chalk')
const expect = require('expect')
const test = window.test
const beforeEach = window.beforeEach
const afterEach = window.afterEach

const mergeMeta = require('../src/merge-meta')

let errors = []
const originalConsoleError = console.error
beforeEach(() => {
  errors = []
  console.error = output => errors.push(output)
})

afterEach(() => {
  console.error = originalConsoleError
})

test('merges metadata', () => {
  const f1 = {
    meta: {
      sections: { s1: 's1Def', s2: 's2Def' },
      references: {
        s1: ['sa', 'sb', 'sc', 'se'],
        s2: ['sb', 'sc', 'sd']
      },
      attributeToEntity: {
        'EntityA.att1': 'replaced',
        'EntityB.att1': 'EntityB',
        'EntityC.att1': 'EntityC'
      }
    }
  }
  const f2 = {
    meta: {
      sections: { s2: 's2DefB', s3: 's3Def' },
      references: {
        s2: ['sc', 'sd', 'se'],
        s3: ['sd', 'se', 'sf']
      },
      attributeToEntity: {
        'EntityA.att2': 'EntityA',
        'EntityB.att2': 'replaced',
        'EntityC.att2': 'EntityC'
      }
    }
  }
  const f3 = {
    meta: {
      sections: { s3: 's3DefB', s4: 's4Def' },
      references: {
        s3: ['sf', 'sg', 'sh'],
        s4: ['sj', 'sk', 'sl']
      },
      attributeToEntity: {
        'EntityA.att1': 'EntityA',
        'EntityA.att3': 'EntityA',
        'EntityB.att2': 'EntityB',
        'EntityB.att3': 'EntityB',
        'EntityC.att3': 'EntityC'
      }
    }
  }
  const merged = {
    sections: { s1: 's1Def', s2: 's2DefB', s3: 's3DefB', s4: 's4Def' },
    references: {
      s1: ['sa', 'sb', 'sc', 'se'],
      s2: ['sb', 'sc', 'sd', 'se'],
      s3: ['sd', 'se', 'sf', 'sg', 'sh'],
      s4: ['sj', 'sk', 'sl']
    },
    backReferences: {
      sa: ['s1'],
      sb: ['s1', 's2'],
      sc: ['s1', 's2'],
      sd: ['s2', 's3'],
      se: ['s1', 's2', 's3'],
      sf: ['s3'],
      sg: ['s3'],
      sh: ['s3'],
      sj: ['s4'],
      sk: ['s4'],
      sl: ['s4']
    },
    attributeToEntity: {
      'EntityA.att1': 'EntityA',
      'EntityA.att2': 'EntityA',
      'EntityA.att3': 'EntityA',
      'EntityB.att1': 'EntityB',
      'EntityB.att2': 'EntityB',
      'EntityB.att3': 'EntityB',
      'EntityC.att1': 'EntityC',
      'EntityC.att2': 'EntityC',
      'EntityC.att3': 'EntityC'
    },
    entityAttributes: {}
  }
  expect(mergeMeta([f1, f2, f3]))
    .toStrictEqual(merged)
  expect(errors).toEqual([
    chalk.red('ERROR: Duplicate section code: s2. The code has been overwritten.'),
    chalk.red('ERROR: Duplicate section code: s3. The code has been overwritten.')
  ])
})

test('back references on attributes', () => {
  const f1 = {
    meta: {
      sections: { s1: 's1Def', s2: 's2Def' },
      references: {
        s1: ['EntityB.att1', 'EntityB.att2', 'EntityB.att3', 'EntityC.att2'],
        s2: ['EntityA.att1', 'EntityC.att3']
      },
      attributeToEntity: {
        'EntityA.att1': 'EntityA',
        'EntityB.att1': 'EntityB',
        'EntityB.att2': 'EntityB',
        'EntityB.att3': 'EntityB',
        'EntityC.att1': 'EntityC'
      }
    }
  }
  const f2 = {
    meta: {
      sections: { s2: 's2DefB', s3: 's3Def' },
      references: {
        s2: ['EntityB.att2', 'EntityA.att1'],
        s3: ['EntityA.att1', 'EntityB.att1']
      },
      attributeToEntity: {
        'EntityC.att2': 'EntityC',
        'EntityC.att3': 'EntityC'
      }
    }
  }
  const merged = {
    sections: { s1: 's1Def', s2: 's2DefB', s3: 's3Def' },
    references: {
      s1: ['EntityB.att1', 'EntityB.att2', 'EntityB.att3', 'EntityC.att2'],
      s2: ['EntityA.att1', 'EntityC.att3', 'EntityB.att2'],
      s3: ['EntityA.att1', 'EntityB.att1']
    },
    backReferences: {
      EntityA: ['s2', 's3'],
      EntityB: ['s1', 's2', 's3'],
      EntityC: ['s1', 's2']
    },
    attributeToEntity: {
      'EntityA.att1': 'EntityA',
      'EntityB.att1': 'EntityB',
      'EntityB.att2': 'EntityB',
      'EntityB.att3': 'EntityB',
      'EntityC.att1': 'EntityC',
      'EntityC.att2': 'EntityC',
      'EntityC.att3': 'EntityC'
    },
    entityAttributes: {}
  }
  expect(mergeMeta([f1, f2]))
    .toStrictEqual(merged)
  expect(errors).toEqual([
    chalk.red('ERROR: Duplicate section code: s2. The code has been overwritten.')
  ])
})

test('merges empty files', () => {
  expect(mergeMeta([]))
    .toStrictEqual({ sections: {}, references: {}, backReferences: {}, attributeToEntity: {}, entityAttributes: {} })
  expect(errors).toEqual([])
})
