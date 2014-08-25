var middleware = {};

middleware.set_session = function() {
  return function(req, res, next) {
    req.session.set = "garbage";
    return res.send("done");
  }
}

middleware.get_session = function() {
  return function(req, res, next) {
    return res.send("req.session.set = " + req.session.set);
  }
}

middleware.index = function() {
  return function(req, res, next) {
    res.render('index', {
      title: 'Express'
    });
  }
}

middleware.authorize = function(oauth) {
  return function(req, res, next) {
    var redirect_url = oauth.getAuthorizeUrl({
      redirect_uri: process.env.GITHUB_REDIRECT_URI,
      scope: process.env.GITHUB_SCOPE
    });
    return res.redirect(redirect_url);
  }
}

middleware.login = function(flows, login) {
  return function(req, res, next) {
    if (req.query.error) return next(new Error(req.query.Error));
    flows.login(req.query.code, function(err, results) {
      if (err) return res.redirect(login);
      req.session.access_token = results.access_token;
      req.session.github_user = results.user.login;
      return next();
    });
  }
}

middleware.return_session = function() {
  return function(req, res, next) {
    return res.json(req.session);
  }
}

middleware.not_found = function() {
  return function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
}

middleware.error = function() {
  return function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  }
}

middleware.redirect = function(location) {
  return function(req, res, next) {
    if (typeof location == "string") return res.redirect(location);
    return res.redirect(location(req));
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

middleware.user_param = function(models) {
  return function(req, res, next, id) {
    models.user.read(id, function(err, user) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  }
}

middleware.user = function(models) {
  return function(req, res, next) {
    models.user.read(req.session.github_user, function(err, user) {
      if (err) return next(err);
      req.user = user;
      return next();
    });
  }
}

middleware.list_param = function(models) {
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

middleware.session_destroy = function() {
  return function(req, res, next) {
    req.session.destroy();
    return next();
  }
}

middleware.lists = function(models) {
  return function(req, res, next) {
    models.lists.read(req.params.user, function(err, lists) {
      console.log(err);
      console.log(lists);
      if (err) return next(err);
      req.lists = lists;
      return next();
    });
  }
};


module.exports = middleware;