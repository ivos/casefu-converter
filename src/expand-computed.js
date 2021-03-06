const { icons } = require('./common')
const { generateERD } = require('./uml-erd')

const sectionLink = (meta, code) => {
  const translated = meta.attributeToEntity[code]
  const section = meta.sections[translated || code]
  if (!section) {
    return `<a href="#${translated || code}" title="${code}">${code}</a>`
  }
  const title = section.type === 'useCase' ? `${code} - ${section.name}` : section.name
  return `<i class="${icons[section.type]} text-muted"></i>&nbsp;` +
    `<a href="#${translated || code}" title="${title}">${translated ? code : section.name}</a>`
}

const expandComputed = (html, sectionCode, meta) => {
  let refersTo = ''
  if (meta.references[sectionCode]) {
    refersTo = `
<div id="section-refers-to-${sectionCode}">
<strong>Refers to:</strong>\n`
    const refersToHtml = meta.references[sectionCode]
      .map(ref => sectionLink(meta, ref))
      .join(',\n')
    refersTo += refersToHtml + `\n</div>`
  }

  let referredFrom = ''
  if (meta.backReferences[sectionCode]) {
    referredFrom = `
<div id="section-referred-from-${sectionCode}">
<strong>Referred from:</strong>\n`
    const referredFromHtml = meta.backReferences[sectionCode]
      .map(ref => sectionLink(meta, ref))
      .join(',\n')
    referredFrom += referredFromHtml + `\n</div>`
  }
  const erd = generateERD(sectionCode, meta)

  const expanded = `<div id="section-computed-${sectionCode}">${refersTo}${referredFrom}${erd}
</div>`
  return html.replace(`<div id="section-computed-${sectionCode}"/>`, expanded)
}

module.exports = expandComputed
