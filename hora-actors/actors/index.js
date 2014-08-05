module.exports = function(model, github) {
  var actors = {};
  actors.lists = {};
  actors.lists.write = require("./actors.lists.write")(model, github);
  actors.lists.read = require("./actors.lists.read")(model, github);
  return actors;
}