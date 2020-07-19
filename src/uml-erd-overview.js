const { plantImg } = require('./plant-code')
const { findRefAtt, relationsToUml } = require('./uml-erd')

const generateERDOverview = (meta) => {
  let erd = ''
  const entityCodes = Object.keys(meta.sections || {})
    .filter(sectionCode => meta.sections[sectionCode].type === 'entity')
  if (entityCodes.length) {
    const umlEntities = entityCodes
      .map(entityCode => `entity ${entityCode} {}\n`)
    const relations = entityCodes
      .map(entityCode => [entityCode, meta.references[entityCode] || []])
      .map(([entityCode, entityRelations]) =>
        entityRelations.map(relation => [entityCode, relation]))
      .reduce((acc, val) => acc.concat(val), [])
      .filter(([fromCode, toCode]) => (meta.sections[toCode] || {}).type === 'entity')
      .map(([fromCode, toCode]) => [fromCode, toCode, findRefAtt(meta, fromCode, toCode)])
      .filter(([fromCode, toCode, att]) => att)
      .map(([fromCode, toCode, att]) => [fromCode, toCode, att.status])
    const umlRelations = relationsToUml(relations)

    const uml = `@startuml
hide circle
skinparam linetype ortho

${umlEntities.join('')}
${umlRelations.join('')}
@enduml
`
    const img = plantImg(uml)
    erd = `
<div id="overview-diagram-erd">
<div><strong>ERD:</strong></div>
${img}
</div>`
  }
  return erd
}

module.exports = {
  generateERDOverview
}
