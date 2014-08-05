module.exports = function(db) {
  var models = {};
  models.users = require("./models.users")(db);
  models.repos = require("./models.repos")(db);
  models.lists = require("./models.lists")(db);
  return models;
}