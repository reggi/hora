var middleware = {};

middleware.user = function(models) {
  return function(req, res, next) {
    models.user.read(req.session.github_user, function(err, user) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  }
}

middleware.api_access = function() {
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

middleware.req_json = function(item, error) {
  error = (error) ? error : false;
  if (error) {
    return function(err, req, res, next) {
      if (typeof item == "function") return res.json(item(req));
      return res.json(item);
    }
  } else {
    return function(req, res, next) {
      if (typeof item == "function") return res.json(item(req));
      return res.json(item);
    }
  }
}

var stack = function(models) {
  return [
    middleware.user(models),
    middleware.api_access(),
    middleware.req_json(function(req) {
      var json = {};
      json.user = req.user;
      json.loggedin = true;
      return json;
    }),
    middleware.req_json({
      "loggedin": false
    }, true),
  ]
};

module.exports = {
  "middleware": middleware,
  "stack": stack,
}