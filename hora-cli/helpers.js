var fs = require("fs");
var actions = require("./actions");
var helpers = require("hora-helpers");

helpers.database = function(global) {
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

helpers.file = function(global) {
  return function(callback) {
    if (!global.argv.file) return callback();
    fs.readFile(global.argv.file, "utf8", function(err, file) {
      if (err) return callback(err);
      global.file = JSON.parse(file);
      return callback();
    });
  }
}

helpers.controller = function(global) {
  var model = global.argv._[0];
  var action = global.argv._[1];
  return actions[model][action](global);
}

module.exports = helpers;