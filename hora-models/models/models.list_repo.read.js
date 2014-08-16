module.exports = function(db, github) {

  var models = {};
  models.lists = {};
  models.repo = {}
  models.lists.read = require("./models.lists.read")(db);
  models.repo.read = require("./models.repo.read")(db);

  var _ = require("underscore");
  var async = require("async");
  var global = {
    "list": false,
  }

  var get_list = function(models, options) {
    return function(callback) {
      return models.lists.read(options, function(err, lists) {
        if (err) return callback(err);
        global.list = lists[0];
        return callback();
      });
    }
  }

  var get_repo = function(models) {
    return function(full_name, callback) {
      return models.repo.read({
        "full_name": full_name
      }, function(err, data) {
        if (err) return callback(err);
        if (!data) return callback(new Error("data is undefined"));
        var condensed = {
          "stargazers_count": data.repo.stargazers_count,
          "watchers_count": data.repo.watchers_count,
          "name": data.repo.name,
          "owner": data.repo.owner.login,
          "size": data.repo.size,
          "open_issues": data.repo.open_issues,
          "language": data.repo.language,
          "html_url": data.repo.html_url
        };
        return callback(null, condensed);
      });
    }
  }

  var get_repos = function(models, options) {
    return function(callback) {
      return async.map(global.list.items, get_repo(models), function(err, repos) {
        if (err) return callback(err);
        global.list.items = _.sortBy(repos, function(repo) {
          return repo.stargazers_count * -1;
        });
        return callback();
      });
    }
  }

  var get_list_repos = function(models) {
    return function(options, callback) {
      return async.waterfall([
        get_list(models, options),
        get_repos(models, options)
      ], function(err) {
        if (err) return callback(err);
        return callback(null, global.list);
      });
    }
  }

  return get_list_repos(models, github);

}