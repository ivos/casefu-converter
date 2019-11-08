const pascalCase = require('pascal-case')
const {
  icons,
  token,
  sectionCode,
  sectionName,
  keep,
  sectionStart,
  isHeading
} = require('./common')

const actorCode = () => sectionCode() ||
  pascalCase(sectionName().replace(/[^\w]+/g, ' '))

const actorStart = () => {
  const sectionCodeValue = sectionCode()
  const actorCodeValue = actorCode()
  sectionStart('actor', sectionCodeValue || actorCodeValue, token().text.substring('Actor:'.length))
  if (!sectionCodeValue) {
    token().text += ' `' + actorCodeValue + '`'
  }
  token().text = token().text.replace(/Actor:\s*/, `<i class="${icons.actor} text-muted"></i> `)
  keep()
}

const isActor = () => isHeading(2) && token().text.startsWith('Actor:')

module.exports = {
  actorStart,
  isActor
}
