import kit from 'terminal-kit'

const { terminal } = kit

const style = {
  hasBorder: true,
  contentHasMarkup: true,
  borderChars: 'lightRounded',
  borderAttr: { color: 'blue' },
  textAttr: { bgColor: 'default' },
  width: 120,
  fullscreen: true,
  fit: true   // Activate all expand/shrink + wordWrap
}

// One can add colors '^YThis ^Mis ^Ca ^Rcell ^Gwith ^Bmarkup^R^+!'
function toTable (node, displayCell = (node) => `${node.name} ^Y${node.sample?.count}`) {
  const table = []

  function visit (node, indent = 0) {
    let row = Array.from(''.repeat(indent))
    row[indent] = displayCell(node)
    table.push(row)
    for (const child of node.children) {
      visit(child, indent++)
    }
  }

  visit(node)
  return table
}

function draw (sample, displayCell) {
  const table = toTable(sample, displayCell)
  terminal.table(table, style)
}

export { draw }
