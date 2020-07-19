const {
  icons
} = require('./common')
const {
  generateERDOverview
} = require('./uml-erd-overview')

const buildOverviewDiagramsSection = meta => {
  return `<section id="__overview_diagrams">
<h2><i class="${icons.entity} text-muted"></i> ERD</h2>
<ul>
${generateERDOverview(meta)}
</ul>
</section>
`
}

module.exports = buildOverviewDiagramsSection
