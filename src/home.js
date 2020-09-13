const {
  context,
  token,
  keep,
  html,
  isHeading
} = require('./common')

const homeStart = () => {
  html('<section id="__home">')
  context().inHome = true
  if (!context().meta.systemName) {
    context().meta.systemName = token().text
  }
  keep()
}
const homeEnd = () => {
  html('</section>')
  context().inHome = false
}

const isHome = () => isHeading(1)

module.exports = {
  homeStart,
  homeEnd,
  isHome
}
