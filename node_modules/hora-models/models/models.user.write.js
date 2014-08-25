module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  return function(options, callback) {
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

};