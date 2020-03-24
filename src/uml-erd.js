const plantumlEncoder = require('plantuml-encoder')

const stripWrappers = (wrapper, text) => {
  let matches = text.match(wrapper)
  while (matches) {
    text = matches[1].trim()
    matches = text.match(wrapper)
  }
  return text
}

const generateERD = (sectionCode, meta) => {
  let erd = ''
  if (meta.sections[sectionCode].type === 'entity') {
    const attributes = Object.entries(meta.entityAttributes[sectionCode])
      .map(([code, { status, dataType }]) => {
        const dataTypeStripped = stripWrappers(/`#([^`]*)`/, dataType)
        const dataTypeStripped2 = stripWrappers(/\[[^\]]*]\(#([^)]*)\)/, dataTypeStripped)
        let uml = `\n  `
        if (['APK', 'NPK', 'FPK', 'PK', 'FK', 'NK', 'BK', 'U', 'M'].includes(status)) uml += `* `
        uml += `${code}`
        if (dataTypeStripped2) uml += ` : ${dataTypeStripped2}`
        if (status) uml += ` <<${status}>>`
        return uml
      })
      .join('')
    let relations = [...(meta.references[sectionCode] || []), ...(meta.backReferences[sectionCode] || [])]
      .filter(reference => meta.sections[reference].type === 'entity')
      .map(reference => `\n${sectionCode} -- ${reference}`)
    relations.sort()
    relations = [...new Set(relations)]
    const uml = `@startuml
hide circle
skinparam linetype ortho

entity ${sectionCode} {${attributes}
}
${relations.join('')}
@enduml
`
    const url = 'http://www.plantuml.com/plantuml/svg/' + plantumlEncoder.encode(uml)
    erd = `
<div id="section-erd-${sectionCode}">
<div><strong>ERD:</strong></div>
<img src="${url}"/>
</div>`
  }
  return erd
}

module.exports = {
  generateERD
}
