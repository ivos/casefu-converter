const chalk = require('chalk')

const verifyCodeDuplicities = (errors, mergedSections, fileSections) => {
  const mergedCodes = Object.keys(mergedSections)
  Object.keys(fileSections)
    .filter(code => mergedCodes.includes(code))
    .forEach(code => {
      const error = `ERROR: Duplicate section code: ${code}. The code has been overwritten.`
      errors.push(error)
      console.error(chalk.red(error))
    })
}

const mergeMeta = files => {
  const merged = files
    .map(file => file.meta)
    .reduce((acc, val) => {
      const systemName = acc.systemName || val.systemName
      verifyCodeDuplicities(acc.errors, acc.sections, val.sections)
      const sections = { ...acc.sections, ...val.sections }
      const references = { ...acc.references }
      const attributeToEntity = { ...acc.attributeToEntity, ...val.attributeToEntity }
      const entityAttributes = { ...acc.entityAttributes, ...val.entityAttributes }
      const errors = [...acc.errors, ...(val.errors || [])]
      Object.keys(val.references).forEach(refKey => {
        const accRefs = references[refKey] || []
        val.references[refKey].forEach(ref => {
          if (!accRefs.includes(ref)) {
            accRefs.push(ref)
          }
        })
        references[refKey] = accRefs
      })
      return { systemName, sections, references, attributeToEntity, entityAttributes, errors }
    }, {
      systemName: undefined,
      sections: {},
      references: {},
      attributeToEntity: {},
      entityAttributes: {},
      errors: []
    })

  merged.backReferences = {}
  Object.keys(merged.references)
    .forEach(key => {
      merged.references[key]
        .forEach(ref => {
          const translated = merged.attributeToEntity[ref]
          const code = translated || ref
          const backRefs = merged.backReferences[code] || []
          if (!backRefs.includes(key)) {
            merged.backReferences[code] = [...backRefs, key]
          }
        })
    })

  return merged
}

module.exports = mergeMeta
