module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  return function(repo, callback) {
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

};