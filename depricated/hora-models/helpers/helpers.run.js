var dotenv = require('dotenv').load();
var helpers = require("../helpers");
var async = require("async");
var run = {};

var establishDatabase = function(callback) {
  helpers.mongodb({
    uri: process.env.MONGO_URI,
    collections: process.env.MONGO_COLLECTIONS
  }, callback);
}

var createUser = function(db, callback) {
  var models = require("../models")(db);
  models.users.write({
    "github_user": "andrewmartis",
    "github_access_token": "fuckthisguy",
  }, function(err, data) {
    return callback(err, data, db);
  });
}

var deleteUser = function(user) {
  return function(db, callback) {
    var models = {};
    models.users = require("../models/models.users")(db);
    models.users.delete(user, function(err, data) {
      return callback(err, data, db);
    });
  }
}

run.deleteUser = function(user) {
  async.waterfall([
    establishDatabase,
    deleteUser(user),
  ], function(err, data, db) {
    if (err) throw err;
    console.log(data);
    db.close();
  });
}

run.createUser = function() {
  async.waterfall([
    establishDatabase,
    createUser,
  ], function(err, data, db) {
    if (err) throw err;
    console.log(data);
    db.close();
  });
}

module.exports = run;