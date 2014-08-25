module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  return function(query, callback) {
    query = helpers.manipulate_options(query, "github_user");
    query.status = "active";
    return db.lists.find(query).toArray(function(err, lists) {
      if (err) return callback(err);
      if (lists.length == 0) return callback(new Error("no lists found"));
      return callback(null, lists);
    });
  }

};