const {
  token,
  sectionCode,
  sectionName,
  keep,
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
  token().text = token().text.replace(/UC:\s*/, '<i class="fas fa-list-alt text-muted"></i> ')
  keep()
}

const isUseCase = () => isHeading(2) && token().text.startsWith('UC:')

module.exports = {
  useCaseStart,
  isUseCase
}
