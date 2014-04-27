// this is a modified version from react-tools

/*global exports:true*/
var es6ArrowFunctions = require('jstransform/visitors/es6-arrow-function-visitors');
var es6Classes = require('jstransform/visitors/es6-class-visitors');
var es6ObjectShortNotation = require('jstransform/visitors/es6-object-short-notation-visitors');
var es6RestParameters = require('jstransform/visitors/es6-rest-param-visitors');
var es6Templates = require('jstransform/visitors/es6-template-visitors');
var sql = require('./sql');

/**
 * Map from transformName => orderedListOfVisitors.
 */
var transformVisitors = {
  'es6-arrow-functions': es6ArrowFunctions.visitorList,
  'es6-classes': es6Classes.visitorList,
  'es6-object-short-notation': es6ObjectShortNotation.visitorList,
  'es6-rest-params': es6RestParameters.visitorList,
  'es6-templates': es6Templates.visitorList,
  'js-sql': sql.visitorList
};

/**
 * Specifies the order in which each transform should run.
 */
var transformRunOrder = [
  'es6-arrow-functions',
  'es6-object-short-notation',
  'es6-classes',
  'es6-rest-params',
  'es6-templates',
  'js-sql'
];

/**
 * Given a list of transform names, return the ordered list of visitors to be
 * passed to the transform() function.
 *
 * @param {array?} excludes
 * @return {array}
 */
function getAllVisitors(excludes) {
  var ret = [];
  for (var i = 0, il = transformRunOrder.length; i < il; i++) {
    if (!excludes || excludes.indexOf(transformRunOrder[i]) === -1) {
      ret = ret.concat(transformVisitors[transformRunOrder[i]]);
    }
  }
  return ret;
}

exports.getAllVisitors = getAllVisitors;
exports.transformVisitors = transformVisitors;
