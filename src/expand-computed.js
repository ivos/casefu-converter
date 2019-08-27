const sectionLink = (meta, code) => {
  const section = meta.sections[code]
  if (!section) {
    console.error('ERROR: Reference to non-existing section via code:', code)
    return ''
  }
  return `<a href="#${code}">${section.name}</a>`
}

const expandComputed = (html, sectionCode, meta) => {
  let refersTo = ''
  if (meta.references[sectionCode]) {
    refersTo = `
<div id="section-refers-to-${sectionCode}">
<strong>Refers to:</strong> `
    const refersToHtml = meta.references[sectionCode]
      .map(ref => sectionLink(meta, ref))
      .join(', ')
    refersTo += refersToHtml + `\n</div>`
  }

  let referredFrom = ''
  if (meta.backReferences[sectionCode]) {
    referredFrom = `
<div id="section-referred-from-${sectionCode}">
<strong>Referred from:</strong> `
    const referredFromHtml = meta.backReferences[sectionCode]
      .map(ref => sectionLink(meta, ref))
      .join(', ')
    referredFrom += referredFromHtml + `\n</div>`
  }

  const expanded = `<div id="section-computed-${sectionCode}">${refersTo}${referredFrom}
</div>`
  return html.replace(`<div id="section-computed-${sectionCode}"/>`, expanded)
}

module.exports = expandComputed
