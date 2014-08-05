var helpers = require("helpers");
var fs = require("fs");

var globals = {};

globals.mongo = function(global) {
  return function(callback) {
    helpers.mongodb({
      uri: process.env.MONGO_URI,
      collections: process.env.MONGO_COLLECTIONS
    }, function(err, db) {
      if (err) return callback(err)
      global.db = db;
      return callback();
    });
  }
}

globals.file = function(global) {
  return function(callback) {
    if (!global.argv.file) return callback();
    fs.readFile(global.argv.file, "utf8", function(err, file) {
      if (err) return callback(err);
      global.file = JSON.parse(file);
      return callback();
    });
  }
}

globals.lists_write = function(global) {
  return function(callback) {

    var options = helpers.list_write_options(global);

    /*
      // via models
      var models = require("models")(global.db);
      return models.lists.write(options, callback);
    */

    /*
      // via actors
      var models = require("models")(global.db);
      var actors = require("actors")(models, github);
      return actors.lists.write(options, callback);
    */

    // via agents
    var agents = require("agents")(global.db, global.github);
    return agents.lists.write(options, callback);

  }
}

module.exports = globals;