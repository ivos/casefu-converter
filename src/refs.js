const {
  context,
  token
} = require('./common')

const captureExpandedReferences = () => {
  const re = /\[([^\]]*)\]\(#([^)]*)\)/
  let text = token().text
  let matches = text.match(re)
  while (matches) {
    const code = matches[2]
    text = text.replace(re, '')
    addReference(context().sectionCode, code)
    matches = text.match(re)
  }
}
const expandInternalLinks = text => {
  const re = /`#([^`]*)`/
  let matches = text.match(re)
  while (matches) {
    const ref = matches[1]
    text = text.replace(re, `[${ref}](#${ref})`)
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
  expandInternalLinks
}
