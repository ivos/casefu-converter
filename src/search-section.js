const {
  icons
} = require('./common')

const listItems = (meta, type) => {
  return Object.keys(meta.sections)
    .filter(code => meta.sections[code].type === type)
    .map(code => `<li class="__search-item" id="__search-item-${code}">
<a href="#${code}" class="mr-3">${meta.sections[code].name}</a> <code>${code}</code>
</li>\n`)
    .join('')
}

const buildSearchSection = meta => {
  const screens = listItems(meta, 'screen')
  const entities = listItems(meta, 'entity')
  const actors = listItems(meta, 'actor')
  const useCases = listItems(meta, 'useCase')
  return `<section id="__search">
<form>
<div class="form-row mb-3">
<div class="input-group mx-2">
<div class="input-group-prepend">
<span class="input-group-text">
<i class="fas fa-search text-muted"></i>
</span>
</div>
<input id="__search-text" type="text" class="form-control"
placeholder="Start typing to search..." />
</div>
</div>
</form>
<h2><i class="${icons.screen} text-muted"></i> Screens</h2>
<ul>
${screens}
</ul>
<h2><i class="${icons.entity} text-muted"></i> Entities</h2>
<ul>
${entities}
</ul>
<h2><i class="${icons.actor} text-muted"></i> Actors</h2>
<ul>
${actors}
</ul>
<h2><i class="${icons.useCase} text-muted"></i> Use cases</h2>
<ul>
${useCases}
</ul>
</section>
`
}

module.exports = buildSearchSection
