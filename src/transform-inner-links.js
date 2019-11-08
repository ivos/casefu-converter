const chalk = require('chalk')

const transformInnerLinks = (fileName, html, meta) => {
  const pattern = /<a href="#([^"]*)"/g
  let matches = html.match(pattern)
  if (matches) {
    matches.forEach(match => {
      const code = match.match(/<a href="#([^"]*)"/)[1]
      if (!meta.sections[code]) {
        console.error(chalk.red(`ERROR: Unknown reference to ${code} in file ${fileName}`))
      }
    })
  }
  return html
}

module.exports = transformInnerLinks
