module.exports = function(models, github) {
  var index = require("./actors")(models, github);
  index.helpers = require("./helpers");
  return index;
}