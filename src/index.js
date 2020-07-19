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
  isUseCase,
  isExtensions,
  extensionsStart,
  extensionsEnd
} = require('./use-cases')
const {
  homeStart,
  homeEnd,
  isHome
} = require('./home')
const {
  processLinks
} = require('./refs')
const { isPlant, plantCode } = require('./plant-code')
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
    return { html: '', meta: { ...emptyMeta(), errors: ['Error parsing Markdown content: ' + error] } }
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
  if (context().inExtensions) {
    extensionsEnd()
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

const emptyMeta = () => ({
  sections: {},
  references: {},
  backReferences: {},
  attributeToEntity: {},
  entityAttributes: {},
  errors: []
})
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
    columnSet: null,
    inColumnValues: false,
    currentColumnValues: null,
    columnValueSet: null,
    tableFields: null,
    tableColumnValues: null,
    insideTable: false,
    afterTable: null,
    inAttributes: false,
    inAttribute: false,
    inExtensions: false,
    inBlockQuote: false
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
  if (isHeading() && context().inExtensions) {
    extensionsEnd()
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
  } else if (isExtensions()) {
    extensionsStart()
  } else if (isListStart() && context().inColumn && !context().inColumnValues && !context().inBlockQuote) {
    columnValuesListStart()
  } else if (isListStart() &&
    (context().inForm || (context().inTable && !context().inColumn) || context().inAttributes) &&
    !context().inBlockQuote) {
    next()
  } else if (isListEnd() && context().fieldSetLevel > 0 && !context().inBlockQuote) {
    fieldSetEnd()
    next()
  } else if (isListEnd() && context().inColumnValues && !context().inBlockQuote) {
    columnValuesListEnd()
  } else if (isListEnd() &&
    (context().inForm || (context().inTable && !context().inColumn) || context().inAttributes) &&
    !context().inBlockQuote) {
    next()
  } else if (isListItemStart() && context().inForm && !context().inBlockQuote) {
    fieldStart()
  } else if (isListItemEnd() && context().inForm && !context().inBlockQuote) {
    fieldEnd()
  } else if (isListItemStart() && (context().inTable && !context().inColumn) && !context().inBlockQuote) {
    columnStart()
  } else if (isListItemStart() && context().inColumnValues && !context().inBlockQuote) {
    columnValueStart()
  } else if (isListItemStart() && context().inAttributes && !context().inBlockQuote) {
    attributeStart()
  } else if (isListItemEnd() && (context().inColumn && !context().inColumnValues) && !context().inBlockQuote) {
    columnEnd()
  } else if (isListItemEnd() && context().inColumnValues && !context().inBlockQuote) {
    columnValueEnd()
  } else if (isListItemEnd() && context().inAttributes && !context().inBlockQuote) {
    attributeEnd()
  } else if (isFieldSet() && context().inField) {
    context().inField = false
    fieldSetStart()
  } else if (isText() && context().inField) {
    field()
  } else if (isText() && context().inColumn && !context().inColumnValues && !context().inBlockQuote) {
    column()
  } else if (isText() && context().inColumn && context().inColumnValues && !context().inBlockQuote) {
    columnValue()
  } else if (isText() && context().inAttribute && !context().inBlockQuote) {
    attribute()
  } else if (isPlant()) {
    plantCode()
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
  if (isBlockQuoteStart()) {
    context().inBlockQuote = true
  }
  if (isBlockQuoteEnd()) {
    context().inBlockQuote = false
  }
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
const isBlockQuoteStart = () => token().type === 'blockquote_start'
const isBlockQuoteEnd = () => token().type === 'blockquote_end'

const htmlTemplate = require('./html-template').htmlTemplate
const mergeMeta = require('./merge-meta')
const expandComputed = require('./expand-computed')
const transformInnerLinks = require('./transform-inner-links')
const buildSearchSection = require('./search-section')
const buildOverviewDiagramsSection = require('./overview-diagrams-section')

module.exports = {
  convert,
  htmlTemplate,
  mergeMeta,
  expandComputed,
  transformInnerLinks,
  buildSearchSection,
  buildOverviewDiagramsSection
}

const convertString = markdown => {
  let { html, meta } = convert(markdown)
  meta = mergeMeta([{ meta }])
  Object.keys(meta.sections)
    .forEach(sectionCode => {
      html = expandComputed(html, sectionCode, meta)
    })
  html = transformInnerLinks('[inline]', html, meta)
  const searchSection = buildSearchSection(meta)
  const overviewDiagramsSection = buildOverviewDiagramsSection(meta)
  html = htmlTemplate(html + overviewDiagramsSection + searchSection)
  let { errors } = meta
  errors.sort()
  errors = [...new Set(errors)]
  return { errors, html, meta }
}

if (typeof window !== 'undefined') {
  window.CaseFuConverter = { convertString }
}
