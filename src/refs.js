const {
  context,
  token
} = require('./common')

const captureExpandedReferences = () => {
  const re = /\[([^\]]*)\]\(#([^")]*)(".*")?\)/
  let text = token().text
  let matches = text.match(re)
  while (matches) {
    const code = matches[2].trim()
    text = text.replace(re, '')
    addReference(context().sectionCode, code)
    matches = text.match(re)
  }
}
const addTitleToExpandedReferences = () => {
  const re = /\[([^\]]*)\]\(#([^)"]*)\)/
  let text = token().text
  let matches = text.match(re)
  while (matches) {
    const label = matches[1]
    const code = matches[2].trim()
    text = text.replace(re, `[${label}](#${code} "${code}")`)
    matches = text.match(re)
  }
  token().text = text
}
const expandInternalLinks = text => {
  const re = /`#([^`]*)`/
  let matches = text.match(re)
  while (matches) {
    const ref = matches[1]
    text = text.replace(re, `[${ref}](#${ref} "${ref}")`)
    addReference(context().sectionCode, ref)
    matches = text.match(re)
  }
  return text
}
const addReference = (from, to) => {
  if (from !== null) {
    const { references } = context().meta
    if (references[from] === undefined) {
      references[from] = [to]
    } else if (!references[from].includes(to)) {
      references[from].push(to)
    }
  }
}

module.exports = {
  captureExpandedReferences,
  addTitleToExpandedReferences,
  expandInternalLinks
}
