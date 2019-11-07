const verifyCodeDuplicities = (mergedSections, fileSections) => {
  const mergedCodes = Object.keys(mergedSections)
  Object.keys(fileSections)
    .filter(code => mergedCodes.includes(code))
    .forEach(code => {
      console.error(`ERROR: Duplicate section code: ${code}. The code has been overwritten.`)
    })
}

const mergeMeta = files => {
  const merged = files
    .map(file => file.meta)
    .reduce((acc, val) => {
      verifyCodeDuplicities(acc.sections, val.sections)
      const sections = { ...acc.sections, ...val.sections }
      const references = { ...acc.references }
      Object.keys(val.references).forEach(refKey => {
        const accRefs = references[refKey] || []
        val.references[refKey].forEach(ref => {
          if (!accRefs.includes(ref)) {
            accRefs.push(ref)
          }
        })
        references[refKey] = accRefs
      })
      return { sections, references }
    }, { sections: {}, references: {} })

  merged.backReferences = {}
  Object.keys(merged.references)
    .forEach(key => {
      merged.references[key]
        .forEach(ref => {
          const backRefs = merged.backReferences[ref] || []
          merged.backReferences[ref] = [...backRefs, key]
        })
    })

  return merged
}

module.exports = mergeMeta
