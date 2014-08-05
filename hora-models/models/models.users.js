var _ = require("underscore");
var helpers = require("hora-helpers");
var models = {};
models.users = {};



module.exports = function(db) {

  models.users.create = function(options, callback) {

    var doc = {
      "created_at": new Date(),
      "github_user": options.github_user,
      "github_access_token": (options.github_access_token) ? options.github_access_token : false,
      "status": "active",
    }

    return db.users.update({
      "github_user": options.github_user,
    }, {
      "$setOnInsert": doc,
    }, {
      "upsert": true,
      "multi": false,
    }, callback);

  }

  models.users.read = function(options, callback) {
    options = helpers.manipulate_options(options, "github_user");

    return db.users.findOne({
      "github_user": options.github_user
    }, callback);

  }

  models.users.update = function(options, callback) {

    var doc = {
      "updated_at": new Date(),
    }

    if (options.github_access_token) doc.github_access_token = options.github_access_token;
    if (options.status) doc.status = options.status;

    return db.users.update({
      "github_user": options.github_user,
    }, {
      "$set": doc,
    }, {
      "upsert": false,
      "multi": false,
    }, callback);

  }

  models.users.log = function(options, callback) {

    var log = {
      "message": options.message,
      "logged_at": new Date(),
    }

    return db.users.update({
      "github_user": options.github_user,
    }, {
      "$push": {
        "log": log
      }
    }, {
      "upsert": false,
      "multi": false,
    }, callback);

  }

  return models.users;

};