const { plantImg } = require('./plant-code')

const stripWrappers = (wrapper, text) => {
  let matches = text.match(wrapper)
  while (matches) {
    text = matches[1].trim()
    matches = text.match(wrapper)
  }
  return text
}

const findRefAtt = (meta, entity, reference) => {
  return Object.values(meta.entityAttributes[entity])
    .find(att => att.dataType.indexOf('`#' + reference + '`') >= 0 ||
      att.dataType.indexOf('(#' + reference + ')') >= 0)
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
    const fwdRelations = (meta.references[sectionCode] || [])
      .filter(reference => (meta.sections[reference] || {}).type === 'entity')
      .map(reference => [sectionCode, reference, findRefAtt(meta, sectionCode, reference).status])
    const backRelations = (meta.backReferences[sectionCode] || [])
      .filter(reference => meta.sections[reference].type === 'entity')
      .map(reference => [reference, sectionCode, findRefAtt(meta, reference, sectionCode).status])
    let relations = [...fwdRelations, ...backRelations]
      .map(([from, to, status]) => {
        const collapsedStatus = (status || '').toLowerCase()
          .replace(/1\.\.1/g, '1')
          .replace(/\*/g, 'n')
          .replace(/m/g, 'n')
          .replace(/0\.\.n/g, 'n')
        if (['fk', 'fpk', 'n : 1'].includes(collapsedStatus)) {
          return `\n${to} ||--o{ ${from}`
        }
        if (['1 : n'].includes(collapsedStatus)) {
          return `\n${from} ||--o{ ${to}`
        }
        if (['fk', '1..n : 1'].includes(collapsedStatus)) {
          return `\n${to} ||--|{ ${from}`
        }
        if (['1 : 1..n'].includes(collapsedStatus)) {
          return `\n${from} ||--|{ ${to}`
        }
        if (['ofk', 'n : 0..1'].includes(collapsedStatus)) {
          return `\n${to} |o--o{ ${from}`
        }
        if (['0..1 : n'].includes(collapsedStatus)) {
          return `\n${from} |o--o{ ${to}`
        }
        if (['0..1 : 1'].includes(collapsedStatus)) {
          return `\n${to} ||--o| ${from}`
        }
        if (['1 : 0..1'].includes(collapsedStatus)) {
          return `\n${from} ||--o| ${to}`
        }
        if (['1 : 1'].includes(collapsedStatus)) {
          return `\n${from} ||--|| ${to}`
        }
        if (['n : n'].includes(collapsedStatus)) {
          return `\n${from} }o--o{ ${to}`
        }
        return `\n${from} -- ${to}`
      })
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
    const img = plantImg(uml)
    erd = `
<div id="section-erd-${sectionCode}">
<div><strong>ERD:</strong></div>
${img}
</div>`
  }
  return erd
}

module.exports = {
  generateERD
}
