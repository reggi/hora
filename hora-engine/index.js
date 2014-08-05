module.exports = function() {
  var engine = {};
  engine.models = require("hora-agents");
  engine.helpers = require("hora-helpers");
  return engine;
}();