const paramCase = require('param-case')
const chalk = require('chalk')

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
  if (context().meta.sections[code]) {
    const error = `ERROR: Duplicate section code: ${code}. The code has been overwritten.`
    context().meta.errors.push(error)
    console.error(chalk.red(error))
  }
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

const findFirstIndex = (text, items) => {
  const firstIndex = items
    .map(item => text.indexOf(item))
    .filter(position => position >= 0)
    .sort((a, b) => a - b)[0]
  return firstIndex === undefined ? -1 : firstIndex
}
const labelStatusStart = '('
const labelStatusEnd = ')'
const labelValue = ':'
const labelHint = ' - '
const fieldName = text => {
  const position = findFirstIndex(text, [labelStatusStart, labelValue, labelHint])
  return (position >= 0)
    ? [text.substring(0, position).trim(), text.substring(position)]
    : [text.trim(), '']
}
const fieldStatusAndType = text => {
  if (text.indexOf(labelStatusStart) === 0) {
    let openBraces = 0
    for (let i = 0; i < text.length; i++) {
      if (text.substring(i).indexOf(labelStatusStart) === 0) openBraces++
      if (text.substring(i).indexOf(labelStatusEnd) === 0) openBraces--
      if (openBraces === 0) {
        return [text.substring(labelStatusStart.length, i).trim(), text.substring(i + labelStatusEnd.length)]
      }
    }
    return [text.substring(labelStatusStart.length).trim(), '']
  }
  return ['', text]
}
const fieldTypeValues = typeAndValues => {
  return (typeAndValues.split(':')[1] || '').trim()
}
const fieldValue = text => {
  if (text.indexOf(labelValue) === 0) {
    text = text.substring(labelValue.length)
    const position = findFirstIndex(text, [labelHint])
    return (position >= 0)
      ? [text.substring(0, position).trim(), text.substring(position)]
      : [text.trim(), '']
  }
  return ['', text]
}
const fieldValues = value => !value ? []
  : value.split(',')
    .map(value => value.trim())
const fieldHint = text => {
  if (text.indexOf(labelHint) === 0) {
    text = text.substring(labelHint.length)
  }
  return text.trim()
}

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
  isHeadingOrHigher,
  fieldName,
  fieldStatusAndType,
  fieldTypeValues,
  fieldValue,
  fieldValues,
  fieldHint
}
