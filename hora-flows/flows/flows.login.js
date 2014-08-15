var async = require("async");
var global = {
  "access_token": false,
  "user": false,
  "stored_customer": false
}

var access_token = function(oauth, code) {
  return function(callback) {
    oauth.getOAuthAccessToken(code, {}, function(err, access_token) {
      if (err) return callback(err);
      if (!access_token) return callback(new Error("access_token is undefined"));
      global.access_token = access_token;
      return callback();
    });
  }
}

var user = function(github) {
  return function(callback) {
    github.authenticate({
      type: "oauth",
      token: global.access_token
    });
    github.user.get({}, function(err, user) {
      if (err) return callback(err);
      global.user = user;
      return callback();
    });
  }
}

var create_user = function(models) {
  return function(callback) {
    models.users.write({
      "github_user": global.user.login,
      "github_access_token": global.access_token,
      "github_data": global.user,
    }, function(err, success) {
      if (err) return callback(err);
      global.stored_customer = success;
      return callback();
    });
  }
}

//oauth, code, models, github, 
module.exports = function(options, callback) {
  return async.waterfall([
    access_token(options.oauth, options.code),
    user(options.github),
    create_user(options.models),
  ], function(err) {
    if (err) return callback(err, global);
    if (!global.access_token) return callback(new Error("access_token unretreavable"));
    if (!global.user.login) return callback(new Error("user unretreavable"));
    if (!global.stored_customer) return callback(new Error("stored_customer failed"));
    return callback(null, global);
  });
}