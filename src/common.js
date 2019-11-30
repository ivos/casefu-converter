const paramCase = require('param-case')

const icons = {
  screen: 'fas fa-desktop',
  entity: 'fas fa-database',
  actor: 'fas fa-user',
  useCase: 'fas fa-list-alt'
}

let _context = null

const context = () => _context

const setContext = context => {
  _context = context
}

const token = () => context().tokens[context().i]
const next = () => context().i++
const nextAutoId = () => `cf-aid-${context().sectionCode || ''}-${context().autoId++}`

const sectionCode = () => {
  const codeStart = token().text.indexOf('`')
  if (codeStart > -1 && codeStart < token().text.length - 1) {
    const codeEnd = token().text.indexOf('`', codeStart + 1)
    if (codeEnd > -1) {
      return token().text.substring(codeStart + 1, codeEnd)
    }
  }
}

const sectionName = () => {
  const colon = token().text.indexOf(':')
  if (colon > -1) {
    return token().text.substring(colon + 1).trim()
  }
  return token().text
}

const addToken = token => context().work.push(token)
const keep = () => {
  addToken(token())
  next()
}
const html = html => addToken({ type: 'html', pre: false, text: html + '\n' })

const addSection = (type, code, name) => {
  context().meta.sections[code] = { type, name }
}
const sectionStart = (type, code, name) => {
  html(`<section id="${code}" class="cf-${paramCase(type)}">`)
  context().inSection = true
  context().sectionCode = code
  name = name.replace(/`[^`]*`/g, '').trim()
  addSection(type, code, name)
}

const isText = () => token().type === 'text'
const isHeading = (level = null) => token().type === 'heading' && (!level || token().depth === level)
const isHeadingOrHigher = level => token().type === 'heading' && token().depth <= level

module.exports = {
  icons,
  context,
  setContext,
  token,
  next,
  nextAutoId,
  sectionCode,
  sectionName,
  addToken,
  keep,
  html,
  sectionStart,
  isText,
  isHeading,
  isHeadingOrHigher
}
