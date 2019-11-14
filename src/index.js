const marked = require('marked')
const {
  context,
  setContext,
  token,
  next,
  keep,
  html,
  isText,
  isHeading,
  isHeadingOrHigher
} = require('./common')
const {
  screenStart,
  formStart,
  formEnd,
  tableStart,
  tableEnd,
  fieldSetStart,
  fieldSetEnd,
  fieldStart,
  fieldEnd,
  columnStart,
  columnEnd,
  columnValuesListStart,
  columnValuesListEnd,
  columnValueStart,
  columnValueEnd,
  field,
  column,
  columnValue,
  isScreen,
  isForm,
  isReadOnlyForm,
  isTable,
  isFieldSet
} = require('./screens')
const {
  entityStart,
  attributesStart,
  attributesEnd,
  attributeStart,
  attributeEnd,
  attribute,
  isEntity,
  isAttributes
} = require('./entities')
const {
  actorStart,
  isActor
} = require('./actors')
const {
  useCaseStart,
  isUseCase
} = require('./use-cases')
const {
  homeStart,
  homeEnd,
  isHome
} = require('./home')
const {
  processLinks
} = require('./refs')
require('./marked-link')

const debug = false

marked.setOptions({
  headerIds: false,
  smartLists: true,
  silent: true
})

const convert = markdown => {
  const tokensParsed = marked.lexer(markdown)
  debug && console.log('tokens parsed', tokensParsed)
  const tokensProcessed = process(tokensParsed)
  debug && console.log('tokens processed', tokensProcessed)
  let html
  try {
    html = marked.parser(tokensProcessed)
  } catch (error) {
    console.error('Error parsing Markdown content.', error)
    return { html: '', meta: emptyMeta() }
  }
  debug && console.log('formatted', html)
  const { meta } = context()
  debug && console.log('meta', meta)
  return { html, meta }
}

const process = tokens => {
  debug && console.log('>> [ENTRY] process')
  initContext(tokens)
  while (!isEnd()) {
    processTopLevelToken()
  }
  while (context().fieldSetLevel > 0) {
    fieldSetEnd()
  }
  if (context().inForm) {
    formEnd()
  }
  if (context().inTable) {
    tableEnd()
  }
  if (context().inAttributes) {
    attributesEnd()
  }
  if (context().inSection) {
    sectionEnd()
  }
  if (context().inHome) {
    homeEnd()
  }
  debug && console.log('<< [EXIT] process')
  return context().work
}

const emptyMeta = () => ({ sections: {}, references: {}, attributeToEntity: {} })
const initContext = tokens => {
  const work = []
  work.links = { ...tokens.links }
  setContext({
    tokens,
    i: 0,
    work,
    meta: emptyMeta(),
    autoId: 1,
    inHome: false,
    inSection: false,
    sectionCode: null,
    inReadOnlyForm: false,
    inForm: false,
    inTable: false,
    defaultStatus: null,
    fieldSetLevel: 0,
    inField: false,
    inColumn: false,
    inColumnValues: false,
    currentColumnValues: null,
    columnValueSet: null,
    tableColumnValues: null,
    insideTable: false,
    afterTable: null,
    inAttributes: false,
    inAttribute: false
  })
}

const processTopLevelToken = () => {
  debug && console.log('top level token', token())
  if (isHeading() && context().inForm) {
    formEnd()
  }
  if (isHeading() && context().inTable) {
    tableEnd()
  }
  if (isHeading() && context().inAttributes) {
    attributesEnd()
  }
  if (isHeadingOrHigher(2) && context().inSection) {
    sectionEnd()
  }
  if (isHome() && !context().inHome) {
    homeStart()
  } else if (isScreen()) {
    if (context().inHome) {
      homeEnd()
    }
    screenStart()
  } else if (isEntity()) {
    if (context().inHome) {
      homeEnd()
    }
    entityStart()
  } else if (isActor()) {
    if (context().inHome) {
      homeEnd()
    }
    actorStart()
  } else if (isUseCase()) {
    if (context().inHome) {
      homeEnd()
    }
    useCaseStart()
  } else if (isReadOnlyForm()) {
    formStart('readOnly')
  } else if (isForm()) {
    formStart('optional')
  } else if (isTable()) {
    tableStart('readOnly')
  } else if (isAttributes()) {
    attributesStart()
  } else if (isListStart() && context().inColumn && !context().inColumnValues) {
    columnValuesListStart()
  } else if (isListStart() && (context().inForm || (context().inTable && !context().inColumn) || context().inAttributes)) {
    next()
  } else if (isListEnd() && context().fieldSetLevel > 0) {
    fieldSetEnd()
    next()
  } else if (isListEnd() && context().inColumnValues) {
    columnValuesListEnd()
  } else if (isListEnd() && (context().inForm || (context().inTable && !context().inColumn) || context().inAttributes)) {
    next()
  } else if (isListItemStart() && context().inForm) {
    fieldStart()
  } else if (isListItemEnd() && context().inForm) {
    fieldEnd()
  } else if (isListItemStart() && (context().inTable && !context().inColumn)) {
    columnStart()
  } else if (isListItemStart() && context().inColumnValues) {
    columnValueStart()
  } else if (isListItemStart() && (context().inAttributes)) {
    attributeStart()
  } else if (isListItemEnd() && (context().inColumn && !context().inColumnValues)) {
    columnEnd()
  } else if (isListItemEnd() && context().inColumnValues) {
    columnValueEnd()
  } else if (isListItemEnd() && (context().inAttributes)) {
    attributeEnd()
  } else if (isFieldSet() && context().inField) {
    context().inField = false
    fieldSetStart()
  } else if (isText() && context().inField) {
    field()
  } else if (isText() && context().inColumn && !context().inColumnValues) {
    column()
  } else if (isText() && context().inColumn && context().inColumnValues) {
    columnValue()
  } else if (isText() && context().inAttribute) {
    attribute()
  } else {
    processGenericToken()
  }
}

const isEnd = () => context().i >= context().tokens.length

const sectionEnd = () => {
  html(`<div id="section-computed-${context().sectionCode}"/>
</section>`)
  context().sectionCode = null
  context().inSection = false
}
const processGenericToken = () => {
  if (token().text) {
    token().text = processLinks(token().text)
  }
  if (context().insideTable) {
    context().afterTable.push(token())
    next()
  } else {
    keep()
  }
}

const isListStart = () => token().type === 'list_start'
const isListEnd = () => token().type === 'list_end'
const isListItemStart = () => token().type === 'list_item_start'
const isListItemEnd = () => token().type === 'list_item_end'

const htmlTemplate = require('./html-template').htmlTemplate
const mergeMeta = require('./merge-meta')
const expandComputed = require('./expand-computed')
const transformInnerLinks = require('./transform-inner-links')
const buildSearchSection = require('./search-section')

module.exports = {
  convert,
  htmlTemplate,
  mergeMeta,
  expandComputed,
  transformInnerLinks,
  buildSearchSection
}

if (typeof window !== 'undefined') {
  window.CaseFuConverter = { convert }
}
