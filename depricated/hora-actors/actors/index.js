module.exports = function(model, github) {
  var actors = {};
  actors.lists = {};
  actors.lists.write = require("./actors.lists.write")(model, github);
  actors.lists_repo = {};
  actors.lists_repo.read = require("./actors.lists_repo.read")(model, github);
  return actors;
}