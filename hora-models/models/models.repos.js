module.exports = function(db) {
  var _ = require("underscore");
  var helpers = require("hora-helpers");
  var models = {};
  models.repos = {};

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
    if (!query) return callback(new Error("repos read query invalid"));
    return db.repos.findOne(query, function(err, repo) {
      if (err) return callback(err);
      if (!repo) return callback(new Error(options.full_name + " repo not found"));
      return callback(null, repo);
    });
  }

  return models.repos;

};