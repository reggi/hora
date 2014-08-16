module.exports = function(model, github) {

  var _ = require('underscore');
  var async = require("async");
  var helpers = require("hora-helpers");

  var get_repo = function(github, full_name) {
    return function(callback) {
      full_name = helpers.parse_github_url(full_name);
      full_name = helpers.parse_repo_name(full_name);
      return github.repos.get(full_name, function(err, repo) {
        if (err) {
          return callback(err);
        }
        return callback(null, repo);
      });
    }
  }

  var save_repo = function(models) {
    return function(repo, callback) {
      return models.repos.write(repo, callback);
    }
  }

  var get_save_repo = function(models, github) {
    return function(full_name, callback) {
      return async.waterfall([
        get_repo(github, full_name),
        save_repo(models),
      ]);
    }
  }

  var get_save_repos = function(models, github) {
    return function(callback) {
      return async.map(options.items, get_save_repo(models, github), callback);
    }
  }

  var save_list = function(models, options) {
    return function(callback) {
      console.log(global.notfound);
      //options.items = _.difference(options.items, global.notfound);
      //console.log(options.items);
      return models.lists.write(options, callback);
    }
  }

  var get_save_repos_save_list = function(models, github) {
    return function(options, callback) {
      return async.waterfall([
        get_save_repos(models, github),
        save_list(models, options),
      ], callback);
    }
  }

  return get_save_repos_save_list(model, github);

}