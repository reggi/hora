var _ = require("underscore");

module.exports = function(options, map) {
  if (_.isObject(options)) return options;
  var temp = {};
  temp[map] = options;
  return temp;
}