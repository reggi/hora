var _ = require("underscore");

var middleware = {};

middleware.session_detection = function() {
  return function(req, res, next) {
    var access = function() {
      if (!req.session.access_token) return false;
      if (!req.session.github_user) return false;
      return true;
    }();
    var err = (!access) ? new Error("no session set") : null;
    return next(err);
  }
}

middleware.reclusive = function(callback) {
  var items = [];
  items.push(function(req, res, next) {
    return callback(null, req, res, next);
  });
  items.push(function(err, req, res, next) {
    return callback(err, req, res, next);
  });
  return items;
}

// middleware params

middleware.param_user = function(models) {
  return function(req, res, next, id) {
    models.user.read(id, function(err, user) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  }
}

middleware.param_list = function(models) {
  return function(req, res, next, id) {
    models.list_repo.read({
      "github_user": req.params.user,
      "handle": id,
    }, function(err, list) {
      if (err) return next(err);
      req.list = list;
      return next();
    });
  }
}

// middleware models

middleware.user_via_session_user = function(models) {
  return function(req, res, next) {
    models.user.read(req.session.github_user, function(err, user) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  }
}

middleware.list_read_via_params = function(models) {

}

middleware.lists_read_via_params = function(models) {

}

middleware.list_delete_via_params = function(models) {

}

middleware.list_update_via_params = function(models) {

}

middleware.list_create_via_body = function(models) {

}

module.exports = middleware;