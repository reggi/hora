var _ = require("underscore");

var build_module_object = function(object, modules) {
  var output = {};
  _.each(modules, function(module) {
    _.extend(output, require(module)()["helpers"]);
  })
  return output["helpers"];
}

var modules = ["hora-models"];
module.exports = build_module_object("helpers", modules);