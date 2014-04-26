var fs = require('fs')
var jstransform = require('jstransform')
var Syntax = require('esprima-fb').Syntax
var utils = require('jstransform/src/utils')

function trimLeft(value) {
  return value.replace(/^[ ]+/, '')
}

// modified from reactjs for multi-line string concat
function renderXJSLiteral(node, isFirst, isLast, state, start, end) {
  var lines = node.value.split(/\r\n|\n|\r/)
  var startWithSpace = false
  if (
    !isFirst && (
      node.value.indexOf("\n") == 0
    || node.value.indexOf("\r\n") == 0
    || node.value.indexOf("\r") == 0
    )
  ) startWithSpace = true

  if (start) {
    utils.append(start, state)
  }

  var firstNonEmptyLine = 0
  var lastNonEmptyLine = 0

  lines.forEach(function (line, index) {
    if (line.match(/[^ \t]/)) lastNonEmptyLine = index
    if (line.trim() === "" && index === firstNonEmptyLine) firstNonEmptyLine = index + 1
  })

  lines.forEach(function (line, index) {
    var isFirstLine = index === 0
    var isLastLine = index === lines.length - 1
    var isLastNonEmptyLine = index === lastNonEmptyLine

    // if it's the first literal and it's multi-line start with a space
    if (isFirst && index > firstNonEmptyLine) startWithSpace = true

    // replace rendered whitespace tabs with spaces
    var trimmedLine = line.replace(/\t/g, ' ')

    // trim whitespace touching a newline
    if (!isFirstLine) trimmedLine = trimmedLine.replace(/^[ ]+/, '')
    if (!isLastLine) trimmedLine = trimmedLine.replace(/[ ]+$/, '')
    if (!isFirstLine) utils.append(line.match(/^[ \t]*/)[0], state)

    if (trimmedLine || isLastNonEmptyLine) {
      utils.append(
        (startWithSpace ? "' ' + " : '') +
        JSON.stringify(trimmedLine) +
        (!isLastNonEmptyLine ? " +" : ''),
        state
      )
      if (isLastNonEmptyLine) {
        if (end) utils.append(end, state)
        if (!isLast) utils.append(' + ', state)
      }

      // only restore tail whitespace if line had literals
      if (trimmedLine && !isLastLine) utils.append(line.match(/[ \t]*$/)[0], state)
    }

    if (!isLastLine) utils.append('\n', state)
  })

  utils.move(node.range[1], state)
}

function renderXJSExpressionContainer(traverse, node, isLast, path, state) {
  // Plus 1 to skip `{`.
  utils.append("(", state);
  utils.move(node.range[0] + 1, state)
  traverse(node.expression, path, state)

  if (!isLast && node.expression.type !== Syntax.XJSEmptyExpression) {
    // If we need to append a comma, make sure to do so after the expression.
    utils.catchup(node.expression.range[1], state, trimLeft)
    utils.append(")", state);
    utils.append(' + ', state)
  } else {
    utils.append(")", state);
  }

  // Minus 1 to skip `}`.
  utils.catchup(node.range[1] - 1, state, trimLeft)
  utils.move(node.range[1], state)
  return false
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

  if (childrenToRender.length) {
    var lastRenderableIndex

    childrenToRender.forEach(function(child, index) {
      if (child.type !== Syntax.XJSExpressionContainer ||
          child.expression.type !== Syntax.XJSEmptyExpression) {
        lastRenderableIndex = index
      }
    })

    // if (lastRenderableIndex !== undefined) {
      // utils.append(' + ', state)
    // }

    var isFirstLiteral = true
    childrenToRender.forEach(function(child, index) {
      utils.catchup(child.range[0], state, trimLeft)

      var isLast = index >= lastRenderableIndex

      if (child.type === Syntax.Literal) {
        renderXJSLiteral(child, isFirstLiteral, isLast, state)
        isFirstLiteral = false
      } else if (child.type === Syntax.XJSExpressionContainer) {
        renderXJSExpressionContainer(traverse, child, isLast, path, state)
      } else {
        traverse(child, path, state)
        if (!isLast) utils.append(' + ', state)
      }
    })
  }

  // include the tag's body
  utils.catchup(node.closingElement.range[0], state)

  // skip the closing tag
  utils.move(node.closingElement.range[1], state)

  // get to the end
  // utils.catchup(node.range[1], state)
  return false
}

visitSQLElement.test = function(node, path, state) {
  return (node.type === Syntax.XJSElement
    && node.openingElement.name.name.toLowerCase() === 'sql')
}

var originalFileContents = fs.readFileSync("./test.jss").toString()

var transformedFileData = jstransform.transform([visitSQLElement], originalFileContents)

fs.writeFileSync("./build/test.js", transformedFileData.code)