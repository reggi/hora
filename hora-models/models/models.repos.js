var _ = require("underscore");
var helpers = require("hora-helpers");
var models = {};
models.repos = {};

module.exports = function(db) {

  models.repos.write = function(repo, callback) {
    var query = helpers.repo_query(repo);

    if (!query) return callback(new Error("no query to save repo"))

    return db.repos.update(query, {
      "$setOnInsert": {
        "created_at": new Date,
      },
      "$set": {
        "updated_at": new Date(),
        "repo": repo
      }
    }, {
      "upsert": true,
      "multi": false,
    }, callback);

  }

  models.repos.read = function(options, callback) {

    var query = helpers.repo_query(options);

    return db.repos.findOne(query, callback);

  }

  return models.repos;

};