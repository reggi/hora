var async = require("async");
var helpers = require("hora-helpers");

var get_repo = function(github, full_name) {
  return function(callback) {
    full_name = helpers.parse_github_url(full_name);
    full_name = helpers.parse_repo_name(full_name);
    return github.repos.get(full_name, callback);
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
    ], callback);
  }
}

var get_save_repos = function(models, github, options) {
  return function(callback) {
    return async.map(options.items, get_save_repo(models, github), callback);
  }
}

var save_list = function(models, options, mode) {
  return function(callback) {
    return models.lists.write(options, callback);
  }
}

var get_save_repos_save_list = function(models, github, mode) {
  return function(options, callback) {
    return async.parallel([
      save_list(models, options, mode),
      get_save_repos(models, github, options),
    ], callback);
  }
}

module.exports = get_save_repos_save_list;