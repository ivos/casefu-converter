const plantumlEncoder = require('plantuml-encoder')
const {
  token,
  html,
  next
} = require('./common')

const isPlant = () => token().type === 'code' && token().lang === 'plant'

const plantImg = uml => {
  const url = 'http://www.plantuml.com/plantuml/svg/' + plantumlEncoder.encode(uml)
  return `<img src="${url}"/>`
}
const plantCode = () => {
  html(plantImg(token().text))
  next()
}

module.exports = {
  isPlant,
  plantImg,
  plantCode
}
