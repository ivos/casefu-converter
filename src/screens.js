const {
  icons,
  context,
  token,
  next,
  nextAutoId,
  sectionCode,
  sectionName,
  addToken,
  keep,
  html,
  sectionStart,
  isText,
  isHeading
} = require('./common')
const { processLinks, processLinksToHtml } = require('./refs')

const screenCode = () => sectionCode() ||
  '/' + sectionName().replace(/[^\w]+/g, '/').toLowerCase()

const isLink = () => !!token().text.match(/^\[.*\]\(.*\)|^`#[^`]*`/)
const fieldName = () => token().text.split(/\(|:| - /)[0].trim()
const fieldStatus = () => {
  const statuses = {
    O: 'optional',
    RO: 'readOnly',
    R: 'required'
  }
  const matches = token().text.match(/\(([^:\s)]+).*\)/)
  const status = matches && matches[1]
  const mappedStatus = statuses[status] || status
  return Object.values(statuses).includes(mappedStatus) ? mappedStatus : context().defaultStatus
}
const fieldType = () => {
  const types = ['text', 'password', 'date', 'time', 'multiLine', 'checkbox',
    'select', 'radios', 'multiSelect', 'checkboxes']
  const matches = token().text.match(/\(([^:]+).*\)/)
  const statusAndType = matches && matches[1].split(/\s/)
  const type = statusAndType && statusAndType[statusAndType.length - 1]
  return types.includes(type) ? type : null
}
const fieldTypeValues = () => {
  const matches = token().text.match(/\([^:]+:(.+)\)/)
  return matches && matches[1]
}
const fieldValue = () => {
  const firstParenStart = token().text.indexOf('(')
  const firstColon = token().text.indexOf(':')
  if (firstParenStart > -1 && firstParenStart < firstColon) {
    const afterFirstParenStart = token().text.substring(firstParenStart + 1)
    const firstParenEnd = afterFirstParenStart.indexOf(')')
    if (firstParenEnd > -1) {
      const afterType = afterFirstParenStart.substring(firstParenEnd + 1)
      return fieldValueAfterType(afterType)
    }
    return ''
  }
  return fieldValueAfterType(token().text)
}
const fieldValueAfterType = afterType => {
  const matches = afterType.match(/:(.*)/)
  if (matches) {
    const valueWithMaybeHint = matches[1]
    const hintStart = valueWithMaybeHint.indexOf(' - ')
    return hintStart > -1 ? valueWithMaybeHint.substring(0, hintStart).trim() : valueWithMaybeHint.trim()
  }
  return ''
}
const fieldValues = value => !value ? []
  : value.split(',')
    .map(value => value.trim())
const fieldHint = () => {
  const matches = token().text.match(/ - (.*)/)
  return (matches && matches[1].trim()) || ''
}

const screenStart = () => {
  const sectionCodeValue = sectionCode()
  const screenCodeValue = screenCode()
  sectionStart('screen', sectionCodeValue || screenCodeValue, token().text.substring('Screen:'.length))
  if (!sectionCodeValue) {
    token().text += ' `' + screenCodeValue + '`'
  }
  token().text = token().text.replace(/Screen:\s*/, `<i class="${icons.screen} text-muted"></i> `)
  keep()
}
const formStart = defaultStatus => {
  html(`<div class="card">
<div class="card-body pb-0">`)
  token().text = token().text.replace(/Form:\s*|ReadOnlyForm:\s*/, '<i class="fas fa-list text-muted"></i> ')
  keep()
  context().inForm = true
  context().defaultStatus = defaultStatus
}
const formEnd = () => {
  html(`</div>
</div>`)
  context().defaultStatus = null
  context().inForm = false
}
const tableStart = defaultStatus => {
  html(`<div class="card">
<div class="card-body pb-0">`)
  token().text = token().text.replace(/Table:\s*|EditTable:\s*/, '<i class="fas fa-table text-muted"></i> ')
  keep()
  html(`<table class="table table-bordered table-sm">
<thead>
<tr>`)
  context().inTable = true
  context().defaultStatus = defaultStatus
  context().tableFields = []
  context().tableColumnValues = []
  context().insideTable = false
  context().afterTable = []
}
const tableEnd = () => {
  html(`</tr>
</thead>`)
  const rows = context().tableColumnValues.reduce((acc, columnValues) => Math.max(acc, columnValues.length), 0)
  for (let row = 0; row < rows; row++) {
    html('<tr>')
    context().tableColumnValues.forEach((columnValues, index) => {
      html('<td>')
      const tableField = context().tableFields[index]
      const { name, type, typeValues, disabled, required, hint } = (tableField || {})
      const value = columnValues[row] && columnValues[row].text
      if (value || type) {
        columnWidget({ name, type, typeValues, disabled, required, value: value || '', hint })
      }
      html('</td>')
    })
    html('</tr>')
  }
  html(`</table>`)
  context().afterTable
    .forEach(addToken)
  html(`</div>
</div>`)
  context().afterTable = null
  context().insideTable = false
  context().tableColumnValues = null
  context().tableFields = null
  context().currentColumnValues = null
  context().defaultStatus = null
  context().inTable = false
}
const fieldSetStart = () => {
  html(`<div class="card">
<div class="card-body pb-0">
 <h5 class="card-title">`)
  token().text = token().text.replace(/FieldSet:\s*/, '')
  keep()
  html('</h5>')
  context().fieldSetLevel++
}
const fieldSetEnd = () => {
  html(`</div>
</div>`)
  context().fieldSetLevel--
}
const fieldStart = () => {
  next()
  context().inField = true
}
const fieldEnd = () => {
  context().inField = false
  next()
}
const columnStart = () => {
  html('<th>')
  next()
  context().insideTable = true
  context().inColumn = true
  context().columnSet = false
  context().currentColumnValues = []
}
const columnEnd = () => {
  html('</th>')
  next()
  if (!context().columnSet) {
    context().tableFields && context().tableFields.push({})
  }
  context().tableColumnValues && context().tableColumnValues.push(context().currentColumnValues)
  context().currentColumnValues = null
  context().columnSet = false
  context().inColumn = false
}
const columnValuesListStart = () => {
  next()
  context().inColumnValues = true
}
const columnValuesListEnd = () => {
  next()
  context().inColumnValues = false
}
const columnValueStart = () => {
  next()
  context().columnValueSet = false
}
const columnValueEnd = () => {
  if (!context().columnValueSet) {
    context().currentColumnValues.push({ type: 'text', text: '' })
  }
  next()
}
const columnWidget = ({ name, type, typeValues, disabled, required, value, hint }) => {
  switch (type) {
    case null:
    case 'text':
    case 'password':
      textColumnWidget(name, disabled, required, type, value, hint)
      break
    case 'date':
    case 'time':
      temporalColumnWidget(name, disabled, required, type, value, hint)
      break
    case 'multiLine':
      multiLineColumnWidget(name, disabled, required, value, hint)
      break
    case 'checkbox':
      checkboxColumnWidget(name, disabled, required, value, hint)
      break
    case 'select':
    case 'multiSelect':
      selectColumnWidget(name, disabled, required, type, typeValues, fieldValues(value), hint)
      break
    case 'radios':
      radiosColumnWidget(name, disabled, required, typeValues, fieldValues(value), hint)
      break
    case 'checkboxes':
      checkboxesColumnWidget(name, disabled, required, typeValues, fieldValues(value), hint)
  }
}
const field = () => {
  html(`<div class="form-group row">`)
  if (isLink()) {
    html(`<div class="offset-sm-4 offset-lg-3 col-sm-7 col-lg-8">`)
    token().text = processLinks(token().text)
    keep()
    html(`</div>`)
  } else {
    const name = fieldName()
    const status = fieldStatus()
    const disabled = status === 'readOnly'
    const required = status === 'required'
    const type = fieldType()
    const typeValues = fieldTypeValues()
    const value = fieldValue()
    const hint = fieldHint()
    switch (type) {
      case null:
      case 'text':
      case 'password':
        textField(name, disabled, required, type, value, hint)
        break
      case 'date':
      case 'time':
        temporalField(name, disabled, required, type, value, hint)
        break
      case 'multiLine':
        multiLineField(name, disabled, required, value, hint)
        break
      case 'checkbox':
        checkboxField(name, disabled, required, value, hint)
        break
      case 'select':
      case 'multiSelect':
        selectField(name, disabled, required, type, typeValues, fieldValues(value), hint)
        break
      case 'radios':
        radiosField(name, disabled, required, typeValues, fieldValues(value), hint)
        break
      case 'checkboxes':
        checkboxesField(name, disabled, required, typeValues, fieldValues(value), hint)
    }
  }
  html(`</div>`)
  fieldEnd()
}
const getDisabled = disabled => disabled ? ' disabled' : ''
const getRequired = required => required ? '<span class="cf-required">&nbsp;*</span>' : ''
const getHint = hint => hint ? `\n  <small class="form-text text-muted">${processLinksToHtml(hint)}</small>` : ''
const labelledField = (id, name, required, hint, content) => {
  const labelFor = id ? ` for="${id}"` : ''
  html(` <label${labelFor} class="col-sm-4 col-lg-3 col-form-label">${name}${getRequired(required)}</label>
 <div class="col-sm-7 col-lg-8">
${content}${getHint(hint)}
 </div>`)
}
const textColumnWidget = (name, disabled, required, type, value, hint) => {
  if (disabled && type === null) {
    addToken({ type: 'text', text: processLinks(value) })
  } else {
    html(`  <input type="${type || 'text'}" class="form-control" placeholder="${name}" ` +
      `value="${value}"${getDisabled(disabled)}>${getHint(hint)}`)
  }
}
const textField = (name, disabled, required, type, value, hint) => {
  if (disabled && type === null) {
    html(` <label class="col-sm-4 col-lg-3 col-form-label">${name}</label>
 <div class="col-sm-7 col-lg-8">`)
    addToken({ type: 'text', text: processLinks(value) })
    html(` </div>`)
  } else {
    const id = nextAutoId()
    labelledField(id, name, required, hint,
      `  <input id="${id}" type="${type || 'text'}" class="form-control" placeholder="${name}" ` +
      `value="${value}"${getDisabled(disabled)}>`)
  }
}
const temporalColumnWidget = (name, disabled, required, type, value, hint) => {
  const icon = type === 'date' ? 'far fa-calendar-alt' : 'far fa-clock'
  html(`  <div class="input-group">
   <input type="text" class="form-control" placeholder="${name}" ` +
    `value="${value}"${getDisabled(disabled)}>
   <div class="input-group-append">
    <span class="input-group-text"><i class="${icon}"></i></span>
   </div>
  </div>${getHint(hint)}`)
}
const temporalField = (name, disabled, required, type, value, hint) => {
  const id = nextAutoId()
  const icon = type === 'date' ? 'far fa-calendar-alt' : 'far fa-clock'
  labelledField(id, name, required, hint, `  <div class="input-group">
   <input id="${id}" type="text" class="form-control" placeholder="${name}" ` +
    `value="${value}"${getDisabled(disabled)}>
   <div class="input-group-append">
    <span class="input-group-text"><i class="${icon}"></i></span>
   </div>
  </div>`)
}
const multiLineColumnWidget = (name, disabled, required, value, hint) => {
  html(`  <textarea rows="4" class="form-control" placeholder="${name}"` +
    `${getDisabled(disabled)}>${value}</textarea>${getHint(hint)}`)
}
const multiLineField = (name, disabled, required, value, hint) => {
  const id = nextAutoId()
  labelledField(id, name, required, hint,
    `  <textarea id="${id}" rows="4" class="form-control" placeholder="${name}"` +
    `${getDisabled(disabled)}>${value}</textarea>`)
}
const checkboxColumnWidget = (name, disabled, required, value, hint) => {
  const isTrue = value === true || (value && value.toLowerCase() === 'true')
  html(`  <div class="form-check">
   <input class="form-check-input" type="checkbox"` +
    `${isTrue ? ' checked' : ''}${getDisabled(disabled)}>
   <label class="form-check-label"></label>${getHint(hint)}
  </div>`)
}
const checkbox = (name, disabled, required, value, hint) => {
  const id = nextAutoId()
  const isTrue = value === true || (value && value.toLowerCase() === 'true')
  return `  <div class="form-check">
   <input id="${id}" class="form-check-input" type="checkbox"` +
    `${isTrue ? ' checked' : ''}${getDisabled(disabled)}>
   <label for="${id}" class="form-check-label">${name}${getRequired(required)}</label>${getHint(hint)}
  </div>`
}
const checkboxField = (name, disabled, required, value, hint) => {
  html(` <div class="col-sm-7 col-lg-8 offset-sm-4 offset-lg-3">
${checkbox(name, disabled, required, value, hint)}
 </div>`)
}
const selectColumnWidget = (name, disabled, required, type, typeValues, values, hint) => {
  const options = typeValues ? typeValues.split(',')
    .map(value => value.trim())
    .map(value => `   <option${values.includes(value) ? ' selected' : ''}>${value}</option>`)
    .join('\n') + '\n' : ''
  html(`  <select${type === 'multiSelect' ? ' multiple' : ''} class="form-control"` +
    `${getDisabled(disabled)}>
${type === 'select' ? '   <option></option>\n' : ''}${options}  </select>${getHint(hint)}`)
}
const selectField = (name, disabled, required, type, typeValues, values, hint) => {
  const id = nextAutoId()
  const options = typeValues ? typeValues.split(',')
    .map(value => value.trim())
    .map(value => `   <option${values.includes(value) ? ' selected' : ''}>${value}</option>`)
    .join('\n') + '\n' : ''
  labelledField(id, name, required, hint,
    `  <select id="${id}"${type === 'multiSelect' ? ' multiple' : ''} class="form-control"` +
    `${getDisabled(disabled)}>
${type === 'select' ? '   <option></option>\n' : ''}${options}  </select>`)
}
const radiosColumnWidget = (name, disabled, required, typeValues, values, hint) => {
  let inputName
  const radios = typeValues ? typeValues.split(',')
    .map(value => value.trim())
    .map(value => {
      const id = nextAutoId()
      inputName = inputName || id
      return `  <div class="form-check">
   <input id="${id}" class="form-check-input" type="radio" name="${inputName}" ` +
        `value="${value}"${values.includes(value) ? ' checked' : ''}${getDisabled(disabled)}>
   <label for="${id}" class="form-check-label">${value}</label>
  </div>`
    })
    .join('\n') + getHint(hint) : ''
  html(radios)
}
const radiosField = (name, disabled, required, typeValues, values, hint) => {
  let inputName
  const radios = typeValues ? typeValues.split(',')
    .map(value => value.trim())
    .map(value => {
      const id = nextAutoId()
      inputName = inputName || id
      return `  <div class="form-check">
   <input id="${id}" class="form-check-input" type="radio" name="${inputName}" ` +
        `value="${value}"${values.includes(value) ? ' checked' : ''}${getDisabled(disabled)}>
   <label for="${id}" class="form-check-label">${value}</label>
  </div>`
    })
    .join('\n') : ''
  labelledField(null, name, required, hint, radios)
}
const checkboxesColumnWidget = (name, disabled, required, typeValues, values, hint) => {
  const checkboxes = typeValues ? typeValues.split(',')
    .map(typeValue => typeValue.trim())
    .map(typeValue => checkbox(typeValue, disabled, false, values.includes(typeValue)))
    .join('\n') + getHint(hint) : ''
  html(checkboxes)
}
const checkboxesField = (name, disabled, required, typeValues, values, hint) => {
  const checkboxes = typeValues ? typeValues.split(',')
    .map(typeValue => typeValue.trim())
    .map(typeValue => checkbox(typeValue, disabled, false, values.includes(typeValue)))
    .join('\n') : ''
  labelledField(null, name, required, hint, checkboxes)
}
const column = () => {
  const name = fieldName()
  const status = fieldStatus()
  const disabled = status === 'readOnly'
  const required = status === 'required'
  const type = fieldType()
  const typeValues = fieldTypeValues()
  const hint = fieldHint()
  html(`${name}${getRequired(required)}`)
  context().tableFields.push({ name, disabled, required, type, typeValues, hint })
  context().columnSet = true
  next()
}
const columnValue = () => {
  token().text = processLinks(token().text)
  context().currentColumnValues && context().currentColumnValues.push(token())
  context().columnValueSet = true
  next()
}

const isScreen = () => isHeading(2) && token().text.startsWith('Screen:')
const isForm = () => isHeading(3) && token().text.startsWith('Form:')
const isReadOnlyForm = () => isHeading(3) && token().text.startsWith('ReadOnlyForm:')
const isTable = () => isHeading(3) && token().text.startsWith('Table:')
const isFieldSet = () => isText() && token().text.startsWith('FieldSet:')

module.exports = {
  fieldName,
  screenStart,
  formStart,
  formEnd,
  tableStart,
  tableEnd,
  fieldSetStart,
  fieldSetEnd,
  fieldStart,
  fieldEnd,
  columnStart,
  columnEnd,
  columnValuesListStart,
  columnValuesListEnd,
  columnValueStart,
  columnValueEnd,
  field,
  column,
  columnValue,
  isScreen,
  isForm,
  isReadOnlyForm,
  isTable,
  isFieldSet
}
