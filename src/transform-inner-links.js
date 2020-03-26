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
        let error = `ERROR: Unknown reference to ${code}`
        if (fileName !== '[inline]') {
          error += ` in file ${fileName}`
        }
        meta.errors.push(error)
        console.error(chalk.red(error))
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
