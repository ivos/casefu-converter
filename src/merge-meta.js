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
  const errors = []
  const merged = files
    .map(file => file.meta)
    .reduce((acc, val) => {
      verifyCodeDuplicities(errors, acc.sections, val.sections)
      const sections = { ...acc.sections, ...val.sections }
      const references = { ...acc.references }
      const attributeToEntity = { ...acc.attributeToEntity, ...val.attributeToEntity }
      const entityAttributes = { ...acc.entityAttributes, ...val.entityAttributes }
      Object.keys(val.references).forEach(refKey => {
        const accRefs = references[refKey] || []
        val.references[refKey].forEach(ref => {
          if (!accRefs.includes(ref)) {
            accRefs.push(ref)
          }
        })
        references[refKey] = accRefs
      })
      return { sections, references, attributeToEntity, entityAttributes }
    }, { sections: {}, references: {}, attributeToEntity: {}, entityAttributes: {} })

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

  merged.errors = errors
  return merged
}

module.exports = mergeMeta
