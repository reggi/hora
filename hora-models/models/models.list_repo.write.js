module.exports = function(db, github) {

  var models = {};
  models.list = {};
  models.repo = {};
  models.list.write = require("./models.list.write")(db);
  models.repo.write = require("./models.repo.write")(db);
  var _ = require('underscore');
  var async = require("async");
  var helpers = require("hora-helpers");

  var get_repo = function(full_name) {
    return function(callback) {
      full_name = helpers.parse_github_url(full_name);
      full_name = helpers.parse_repo_name(full_name);
      return github.repos.get(full_name, function(err, repo) {
        if (err) return callback(err);
        return callback(null, repo);
      });
    }
  }

  var save_repo = function() {
    return function(repo, callback) {
      return models.repo.write(repo, callback);
    }
  }

  var get_save_repo = function() {
    return function(full_name, callback) {
      return async.waterfall([
        get_repo(full_name),
        save_repo(),
      ], callback);
    }
  }

  var get_save_repos = function(options) {
    return function(callback) {
      return async.map(options.items, get_save_repo(), function(err, results) {
        if (err) return callback(err);
        if (_.without(results, 1).length !== 0) return callback(new Error("not all repos were fetched and saved"));
        return callback();
      });
    }
  }

  var save_list = function(options) {
    return function(callback) {
      //options.items = _.difference(options.items, global.notfound);
      //console.log(options.items);
      return models.list.write(options, callback);
    }
  }

  var get_save_repos_save_list = function(options, callback) {
    return async.waterfall([
      get_save_repos(options),
      save_list(options),
    ], callback);
  }

  return get_save_repos_save_list;

}