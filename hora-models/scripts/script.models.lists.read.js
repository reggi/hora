var _ = require("underscore");
var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("../helpers");

async.waterfall([

  function(callback) {
    helpers.mongodb({
      uri: process.env.MONGO_URI,
      collections: process.env.MONGO_COLLECTIONS
    }, callback);
  },
  function(db, callback) {
    var models = require("models")(db);
    var options = {};
    if (argv.handle) options.handle = argv.handle;
    if (argv.user) options.github_user = argv.user;
    if (!_.size(options)) return callback(new Error("no arguments"));
    models.lists.read(options, function(err, data) {
      if (err) return callback(err);
      return callback(err, data, db);
    });
  }
], function(err, data, db) {
  if (err) throw err;
  console.log(data);
  db.close();
});