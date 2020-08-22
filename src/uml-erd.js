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
  return Object.values(meta.entityAttributes[entity] || {})
    .find(att => att.dataType.indexOf('`#' + reference + '`') >= 0 ||
      att.dataType.indexOf('(#' + reference + ')') >= 0)
}

const collapseStatus = status => (status || '')
  .toLowerCase()
  .replace(/1\.\.1/g, '1')
  .replace(/\*/g, 'n')
  .replace(/m/g, 'n')
  .replace(/0\.\.n/g, 'n')

const relationToUml = ([from, to, status]) => {
  const collapsedStatus = collapseStatus(status)
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
  if (['0..1 : 1..n'].includes(collapsedStatus)) {
    return `\n${from} |o--|{ ${to}`
  }
  if (['1..n : 0..1'].includes(collapsedStatus)) {
    return `\n${to} |o--|{ ${from}`
  }
  if (['0..1 : 1'].includes(collapsedStatus)) {
    return `\n${to} ||--o| ${from}`
  }
  if (['1 : 0..1'].includes(collapsedStatus)) {
    return `\n${from} ||--o| ${to}`
  }
  if (['0..1 : 0..1'].includes(collapsedStatus)) {
    return `\n${from} |o--o| ${to}`
  }
  if (['1 : 1'].includes(collapsedStatus)) {
    return `\n${from} ||--|| ${to}`
  }
  if (['n : n'].includes(collapsedStatus)) {
    return `\n${from} }o--o{ ${to}`
  }
  return `\n${from} -- ${to}`
}

const relationsToUml = relations => {
  const mapped = relations.map(relationToUml)
  mapped.sort()
  return [...new Set(mapped)]
}

const generateERD = (sectionCode, meta) => {
  let erd = ''
  if (meta.sections[sectionCode].type === 'entity') {
    const attributes = Object.entries(meta.entityAttributes[sectionCode] || {})
      .map(([code, { status, dataType }]) => {
        const dataTypeStripped = stripWrappers(/`#([^`]*)`/, dataType)
        const dataTypeStripped2 = stripWrappers(/\[[^\]]*]\(#([^)]*)\)/, dataTypeStripped)
        let uml = `\n  `
        const collapsedStatus = collapseStatus(status)
        const relationOtherSide = (/^(?:0..1|1..n|1|n) : (?:0..1|1..n|1|n)$/.test(collapsedStatus))
          ? collapsedStatus.match(/^(?:0..1|1..n|1|n) : (0..1|1..n|1|n)$/)[1] : null
        if (['APK', 'NPK', 'FPK', 'PK', 'FK', 'NK', 'BK', 'U', 'M'].includes(status) ||
          ['1..n', '1'].includes(relationOtherSide)) {
          uml += `* `
        }
        uml += `${code}`
        if (dataTypeStripped2) uml += ` : ${dataTypeStripped2}`
        if (status) uml += ` <<${status}>>`
        return uml
      })
      .join('')
    const fwdRelations = (meta.references[sectionCode] || [])
      .filter(reference => (meta.sections[reference] || {}).type === 'entity')
      .map(reference => [reference, findRefAtt(meta, sectionCode, reference)])
      .filter(([reference, att]) => att)
      .map(([reference, att]) => [sectionCode, reference, att.status])
    const backRelations = (meta.backReferences[sectionCode] || [])
      .filter(reference => meta.sections[reference].type === 'entity')
      .map(reference => [reference, findRefAtt(meta, reference, sectionCode)])
      .filter(([reference, att]) => att)
      .map(([reference, att]) => [reference, sectionCode, att.status])
    const umlRelations = relationsToUml([...fwdRelations, ...backRelations])
    const uml = `@startuml
hide circle
skinparam linetype ortho

entity ${sectionCode} {${attributes}
}
${umlRelations.join('')}
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
  findRefAtt,
  relationsToUml,
  generateERD
}
