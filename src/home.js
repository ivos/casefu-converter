const {
  context,
  keep,
  html,
  isHeading
} = require('./common')

const homeStart = () => {
  html('<section id="__home">')
  context().inHome = true
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
