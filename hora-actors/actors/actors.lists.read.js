var _ = require("underscore");
var async = require("async");

var get_list = function(models, options) {
  return function(callback) {
    return models.lists.read(options, function(err, lists) {
      if (err) return callback(err);
      return callback(null, lists[0]);
    });
  }
}

var get_repo = function(models) {
  return function(full_name, callback) {
    return models.repos.read({
      "repo.full_name": full_name
    }, function(err, repo) {
      if (err) return callback(err);
      var condensed = {
        "stargazers_count": repo.data.stargazers_count,
        "watchers_count": repo.data.watchers_count,
        "name": repo.data.name,
        "owner": repo.data.owner.login,
        "size": repo.data.size,
        "open_issues": repo.data.open_issues,
        "language": repo.data.language
      };
      return callback(null, condensed);
    });
  }
}

var get_repos = function(models, options) {
  return function(list, callback) {
    return async.map(list.items, get_repo(models), function(err, repos) {
      if (err) return callback(err);
      list.items = _.sortBy(repos, function(repo) {
        return repo.stargazers_count * -1;
      });
      return callback(null, list);
    });
  }
}

var get_list_repos = function(models) {
  return function(options, callback) {
    return async.waterfall([
      get_list(models, options),
      get_repos(models, options)
    ], callback);
  }
}

module.exports = get_list_repos;