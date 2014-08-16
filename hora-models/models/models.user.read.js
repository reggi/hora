module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  return function(options, callback) {
    options = helpers.manipulate_options(options, "github_user");
    return db.users.findOne({
      "github_user": options.github_user
    }, callback);
  }

};