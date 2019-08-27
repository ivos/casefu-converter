const marked = require('marked')

const cleanUrl = url => {
  try {
    return encodeURI(url).replace(/%25/g, '%')
  } catch (e) {
    return null
  }
}
const escape = html => {
  const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/
  const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  if (escapeTestNoEncode.test(html)) {
    return html.replace(escapeReplaceNoEncode, ch => replacements[ch])
  }
  return html
}
const linkOriginal = marked.Renderer.prototype.link.bind(marked.defaults.renderer)
marked.Renderer.prototype.link = (href, title, text) => {
  const re = new RegExp(
    '^:|^(?:outline-)?primary:|^(?:outline-)?secondary:|' +
    '^(?:outline-)?success:|^(?:outline-)?danger:|^(?:outline-)?warning:|' +
    '^(?:outline-)?info:|^(?:outline-)?light:|^(?:outline-)?dark:')
  const isButton = text && text.match(re)
  if (isButton) {
    href = cleanUrl(href)
    if (href === null) {
      return text
    }
    href = escape(href)
    title = title ? ` title="${title}"` : ''
    const type = text.substring(0, text.indexOf(':')).trim() || 'outline-secondary'
    text = text.substring(text.indexOf(':') + 1).trim()
    return href === ''
      ? `<button type="button" class="btn btn-${type}"${title}>${text}</button>`
      : `<a href="${href}" class="btn btn-${type}"${title}>${text}</a>`
  }
  return linkOriginal(href, title, text)
}
