const {
  icons,
  context,
  token,
  sectionCode,
  sectionName,
  keep,
  html,
  sectionStart,
  isHeading
} = require('./common')

const useCaseCode = () => sectionCode() ||
  sectionName().replace(/[^\w]+/g, '-')

const useCaseStart = () => {
  const sectionCodeValue = sectionCode()
  const useCaseCodeValue = useCaseCode()
  sectionStart('useCase', sectionCodeValue || useCaseCodeValue, token().text.substring('UC:'.length))
  if (!sectionCodeValue) {
    token().text += ' `' + useCaseCodeValue + '`'
  }
  token().text = token().text.replace(/UC:\s*/, `<i class="${icons.useCase} text-muted"></i> `)
  keep()
}
const extensionsStart = () => {
  html(`<div class="cf-extensions">`)
  context().inExtensions = true
  keep()
}
const extensionsEnd = () => {
  context().inExtensions = false
  html(`</div>`)
}

const isUseCase = () => isHeading(2) && token().text.startsWith('UC:')
const isExtensions = () => isHeading(3) && token().text.startsWith('Extensions:')

module.exports = {
  useCaseStart,
  isUseCase,
  isExtensions,
  extensionsStart,
  extensionsEnd
}
