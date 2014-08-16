var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("helpers");
var github = helpers.github();
var DB;

async.waterfall([

  function(callback) {
    helpers.mongodb({
      uri: process.env.MONGO_URI,
      collections: process.env.MONGO_COLLECTIONS
    }, function(err, db) {
      DB = db;
      return callback(err);
    });
  },
  function(file, callback) {
    var models = require("models")(DB);
    var actors = require("actors")(model, github);
    var options = {};
    if (argv.handle) options.handle = argv.handle;
    if (argv.user) options.github_user = argv.user;
    if (!_.size(options)) return callback(new Error("no arguments"));
    actors.lists.read(options, function(err, data) {
      if (err) return callback(err);
      return callback(err, data, db);
    });
  }
], function(err, data) {
  if (err) throw err;
  console.log(data);
  DB.close();
});