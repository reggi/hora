var _ = require("underscore");
module.exports = function(db, github) {
  var models = require("hora-models")(db);
  var actors = require("hora-actors")(models, github);
  var agents = {};
  _.extend(agents, models);
  _.extend(agents, actors);
  return agents;
}