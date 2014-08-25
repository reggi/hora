module.exports = function(oauth, models, github) {

  var async = require("async");
  var global = {
    "list_write": false,
    "list_read": false,
  }

  var session_check = function(list, session) {
    return function(callback) {
      if (session.github_user !== list.user) return callback(new Error("sessions user and list user don't match"));
      return callback();
    }
  }

  var list_update = function(list) {
    return function(callback) {
      models.list.write({
        "name": list.name,
        "github_user": list.user,
        "items": [
          list.item
        ]
      }, function(err, result) {
        if (err) return callback(err);
        global.list_write = result;
        return callback();
      });
    }
  }

  var list_read = function(list) {
    return function(callback) {
      models.lists.read({
        "github_user": list.user,
        "name": list.name,
      }, function(err, result) {
        if (err) return callback(err);
        global.list_read = result;
        return callback(err);
      });
    }
  }

  return function(list, session, callback) {
    async.waterfall([
      session_check(list, session),
      list_update(list),
      list_read(list)
    ], function(err) {
      if (err) return callback(err, global);
      return callback(null, global);
    });
  }

};