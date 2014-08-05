var _ = require("underscore");

module.exports = function() {
  var models = require("hora-models")().helpers;
  var actors = require("hora-actors")().helpers;
  var helpers = {};
  _.extend(helpers, models);
  _.extend(helpers, actors);
  return helpers;
}();