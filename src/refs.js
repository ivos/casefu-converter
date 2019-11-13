const marked = require('marked')
const {
  context
} = require('./common')

const renderer = new marked.Renderer()
const link = renderer.link.bind(renderer)

// Add references from current section to all [Label](#Link "Title")
const captureExpandedReferences = text => {
  const re = /\[([^\]]*)\]\(#([^")]*)(".*")?\)/
  let matches = text.match(re)
  while (matches) {
    const code = matches[2].trim()
    text = text.replace(re, '')
    addReference(context().sectionCode, code)
    matches = text.match(re)
  }
}
// Replace [Label](#Link) => [Label](#Link "Link")
const addTitleToExpandedReferences = text => {
  const re = /\[([^\]]*)\]\(#([^)"]*)\)/
  let matches = text.match(re)
  while (matches) {
    const label = matches[1]
    const code = matches[2].trim()
    text = text.replace(re, `[${label}](#${code} "${code}")`)
    matches = text.match(re)
  }
  return text
}
// Replace `#Link` => [Link](#Link "Link")
// and add reference from current section
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
// Replace [Label](#Link "Title") => <a href="#Link" title="Title">Label</a>
const convertToHtml = text => {
  const re = /\[([^\]]*)\]\(#([^")]*)(?:"([^"]*)")?\)/
  let matches = text.match(re)
  while (matches) {
    const label = matches[1]
    const code = matches[2].trim()
    const title = matches[3].trim()
    text = text.replace(re, link(`#${code}`, title, label))
    matches = text.match(re)
  }
  return text
}
const processLinks = text => {
  captureExpandedReferences(text)
  text = addTitleToExpandedReferences(text)
  text = expandInternalLinks(text)
  return text
}
const processLinksToHtml = text => {
  text = processLinks(text)
  text = convertToHtml(text)
  return text
}

module.exports = {
  processLinks,
  processLinksToHtml
}
