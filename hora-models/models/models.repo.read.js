module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  return function(options, callback) {
    var query = helpers.repo_query(options);
    if (!query) return callback(new Error("repos read query invalid"));
    return db.repos.findOne(query, function(err, repo) {
      if (err) return callback(err);
      if (!repo) return callback(new Error(options.full_name + " repo not found"));
      return callback(null, repo);
    });
  }

};