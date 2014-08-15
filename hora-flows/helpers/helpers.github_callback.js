var async = require("async");
var waterfall = {};

module.exports = function(model) {

  return function(req, callback) {

    waterfall.access_token = function(callback) {
      if (!dotty.exists(req, "query.code")) return callback(new Error("missing query code"));
      oauth.getOAuthAccessToken(req.query.code, {}, function(err, access_token, refresh_token) {
        if (err) return callback(err);
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        return callback(null, access_token, refresh_token);
      });
    }

    waterfall.mongo_store = function(access_token, refresh_token, callback) {
      model.user.create({
        "access_token": access_token,
        "refresh_token": refresh_token
      }, function(err) {
        if (err) return callback(err);
        return callback(null, access_token, refresh_token);
      });
    }

    return async.waterfall([
      waterfall.access_token
    ], function(err, result) {
      if (err) return callback(err);
      return callback(null);
    });

  }

}