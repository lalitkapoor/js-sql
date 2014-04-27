// modified version of react's main.js

var visitors = require('./lib/visitors')
var transform = require('jstransform').transform

module.exports = {
  transform: function(code, options) {
    var visitorList
    if (options && options.harmony) {
      visitorList = visitors.getAllVisitors()
    } else {
      visitorList = visitors.transformVisitors['js-sql']
    }
    return transform(visitorList, code).code
  }
};
