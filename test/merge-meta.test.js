const expect = require('expect')
const test = window.test

const mergeMeta = require('../src/merge-meta')

test('merges metadata', () => {
  const f1 = {
    meta: {
      sections: { s1: 's1Def', s2: 's2Def' },
      references: {
        s1: ['sa', 'sb', 'sc', 'se'],
        s2: ['sb', 'sc', 'sd']
      }
    }
  }
  const f2 = {
    meta: {
      sections: { s2: 's2DefB', s3: 's3Def' },
      references: {
        s2: ['sc', 'sd', 'se'],
        s3: ['sd', 'se', 'sf']
      }
    }
  }
  const f3 = {
    meta: {
      sections: { s3: 's3DefB', s4: 's4Def' },
      references: {
        s3: ['sf', 'sg', 'sh'],
        s4: ['sj', 'sk', 'sl']
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
    }
  }
  expect(mergeMeta([f1, f2, f3])).toStrictEqual(merged)
})
