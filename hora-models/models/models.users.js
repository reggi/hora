module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  var models = {};
  models.users = {};

  models.users.write = function(options, callback) {
    var setOnInsert = {
      "created_at": new Date(),
    }
    var set = {
      "updated_at": new Date(),
      "github_user": options.github_user,
      "github_access_token": (options.github_access_token) ? options.github_access_token : false,
      "github_data": options.github_data,
      "status": "active",
    }
    return db.users.update({
      "github_user": options.github_user,
    }, {
      "$setOnInsert": setOnInsert,
      "$set": set
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