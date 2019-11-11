const chalk = require('chalk')

const transformInnerLinks = (fileName, html, meta) => {
  const pattern = /<a href="#([^"]*)"/g
  let matches = html.match(pattern)
  if (matches) {
    matches.forEach(match => {
      const re = /<a href="#([^"]*)"/
      const code = match.match(re)[1]
      const translated = meta.attributeToEntity[code]
      if (!meta.sections[translated || code]) {
        console.error(chalk.red(`ERROR: Unknown reference to ${code} in file ${fileName}`))
      }
      if (translated) {
        const toBeReplaced = `<a href="#${code}"`
        while (html.includes(toBeReplaced)) {
          html = html.replace(toBeReplaced, `<a href="#${translated}"`)
        }
      }
    })
  }
  return html
}

module.exports = transformInnerLinks
