var fs = require('fs')
var jstransform = require('jstransform')
var Syntax = require('esprima-fb').Syntax
var utils = require('jstransform/src/utils')

function trimLeft(value) {
  return value.replace(/^[ ]+/, '')
}

// this bit from reactjs
function renderXJSLiteral(object, isLast, state, start, end) {
  var lines = object.value.split(/\r\n|\n|\r/)

  if (start) {
    utils.append(start, state)
  }

  var lastNonEmptyLine = 0

  lines.forEach(function (line, index) {
    if (line.match(/[^ \t]/)) {
      lastNonEmptyLine = index
    }
  })

  lines.forEach(function (line, index) {
    var isFirstLine = index === 0
    var isLastLine = index === lines.length - 1
    var isLastNonEmptyLine = index === lastNonEmptyLine

    // replace rendered whitespace tabs with spaces
    var trimmedLine = line.replace(/\t/g, ' ')

    // trim whitespace touching a newline
    if (!isFirstLine) trimmedLine = trimmedLine.replace(/^[ ]+/, '')
    if (!isLastLine) trimmedLine = trimmedLine.replace(/[ ]+$/, '')
    if (!isFirstLine) utils.append(line.match(/^[ \t]*/)[0], state)

    if (trimmedLine || isLastNonEmptyLine) {
      utils.append(
        JSON.stringify(trimmedLine) +
        (!isLastNonEmptyLine ? " + ' ' +" : ''),
        state)

      // only restore tail whitespace if line had literals
      if (trimmedLine && !isLastLine) utils.append(line.match(/[ \t]*$/)[0], state)
    }

    if (!isLastLine) utils.append('\n', state)
  })

  utils.move(object.range[1], state)
}

function visitSQLElement(traverse, node, path, state) {
  // skip the opening tag
  utils.move(node.openingElement.range[1], state)

  // find children to deal with (non-whitespace elements)
  var childrenToRender = node.children.filter(function(child) {
    return !(child.type === Syntax.Literal
      && typeof child.value === 'string'
      && child.value.match(/^[ \t]*[\r\n][ \t\r\n]*$/))

  })

  childrenToRender.forEach(function(child, index) {
    utils.move(child.range[0], state, trimLeft)

    if (child.type === Syntax.Literal) {
      renderXJSLiteral(child, childrenToRender.length, state)
    } else {
      traverse(child, path, state)
    }
  })

  // include the tag's body
  // utils.catchup(node.closingElement.range[0], state)

  // skip the closing tag
  utils.move(node.closingElement.range[1], state)

  // get to the end
  utils.catchup(node.range[1], state)
}

visitSQLElement.test = function(node, path, state) {
  return (node.type === Syntax.XJSElement
    && node.openingElement.name.name.toLowerCase() === 'sql')
}

var originalFileContents = fs.readFileSync("./test.jss").toString()

var transformedFileData = jstransform.transform([visitSQLElement], originalFileContents)

fs.writeFileSync("./build/test.js", transformedFileData.code);