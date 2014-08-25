var flows = require("hora-flows");
var _ = require("underscore");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var middleware = {};

module.exports = function(models, oauth, github) {

  // top level middleware 

  middleware.sessionStore = function(db, secret) {
    return session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        db: db.native,
      })
    });
  }

  middleware.useLocalhost = function(port) {
    return function(req, res, next) {
      var redirect = ["http://localhost:", process.env.PORT, req.path].join();
      if (req.host == "127.0.0.1") res.redirect(redirect);
      return next();
    }
  }

  // github middleware

  middleware.github_login = function() {
    return function(req, res, next) {
      var redirect_url = oauth.getAuthorizeUrl({
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
        scope: process.env.GITHUB_SCOPE
      });
      return res.redirect(redirect_url);
    }
  }

  middleware.github_callback_flow = function() {
    return function(req, res, next) {
      if (req.query.error) return next(new Error(req.query.Error));
      flows(oauth, models, github).login(req.query.code, function(err, results) {
        if (err) return res.redirect(process.env.GITHUB_LOGIN_URI);
        req.session.access_token = results.access_token;
        req.session.github_user = results.user.login;
        return next();
      });
    }
  }

  // error middleware

  middleware.error_404 = function() {
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

  // api middleware

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

  middleware.session_detection_via_user = function() {
    return function(req, res, next) {
      if (req.session.github_user == req.params.user) return next();
      if (req.session.github_user == req.body.user) return next();
      return next(new Error("user not authorized to perform action"));
    }
  }

  // meta-middleware

  middleware.redirect = function(location) {
    return function(req, res, next) {
      if (typeof location == "string") return res.redirect(location);
      return res.redirect(location(req));
    }
  }

  middleware._reclusive = function(callback) {
    var items = [];
    items.push(function(req, res, next) {
      return callback(null, req, res, next);
    });
    items.push(function(err, req, res, next) {
      return callback(err, req, res, next);
    });
    return items;
  }

  middleware.reclusive = function(callback) {
    var items = [];
    items.push(middleware._reclusive(function(err, req, res, next) {
      if (err) console.log(err.stack);
      return next(err);
    }));
    items.push(middleware._reclusive(callback));
    return items;
  };

  // univeral middleware

  middleware.session_destroy = function() {
    return function(req, res, next) {
      req.session.destroy();
      return next();
    }
  }

  middleware.param_error = function() {
    return function(req, res, next) {
      if (req.param_error) return next(req.param_error);
      return next();
    }
  }

  // middleware params

  middleware.param_user = function() {
    return function(req, res, next, id) {
      models.user.read(id, function(err, user) {
        if (err) {
          req.user = null;
          req.param_error = err;
        }
        req.user = user;
        return next();
      });
    }
  }

  middleware.param_list_repos = function() {
    return function(req, res, next, id) {
      models.list_repo.read({
        "github_user": req.params.user,
        "handle": id,
      }, function(err, list) {
        if (err) {
          req.list = null;
          req.param_error = err;
        }
        req.list = list;
        return next();
      });
    }
  }

  middleware.param_list = function() {
    return function(req, res, next, id) {
      models.lists.read({
        "github_user": req.params.user,
        "handle": id,
      }, function(err, list) {
        if (err) {
          req.list = null;
          req.param_error = err;
        }
        req.list = list;
        return next();
      });
    }
  }

  // middleware models

  middleware.user_via_session_user = function() {
    return function(req, res, next) {
      models.user.read(req.session.github_user, function(err, user) {
        if (err) return next(err);
        req.user = user;
        return next();
      });
    }
  }

  middleware.lists_read_via_params = function() {
    return function(req, res, next) {
      models.lists.read(req.params.user, function(err, lists) {
        if (err) return next(err);
        req.lists = lists;
        return next();
      });
    }
  }

  middleware.list_rename_via_params_body = function() {
    return function(req, res, next) {
      var rename_options = {
        "github_user": req.params.user,
        "name": req.list[0].name,
        "rename": req.body.rename,
      };
      models.list.write(rename_options, function(err, lists) {
        if (err) return next(err);
        req.success = lists;
        return next();
      });
    };
  }

  middleware.list_delete_via_params = function() {
    return function(req, res, next) {
      models.list.write({
        "github_user": req.params.user,
        "name": req.params.list,
        "delete": true
      }, function(err, lists) {
        if (err) return next(err);
        return next();
      });
    };
  }

  middleware.list_remove_item_via_params_body = function() {
    return function(req, res, next) {
      var remove_options = {
        "github_user": req.params.user,
        "name": req.list[0].name,
        "items": (req.body.items) ? req.body.items : false,
        "item": (req.body.item) ? req.body.item : false,
        "remove": true,
      };
      models.list.write(remove_options, function(err, lists) {
        if (err) return next(err);
        return next();
      });
    };
  }

  middleware.list_add_via_params_body = function() {
    return function(req, res, next) {
      var add_options = {
        "github_user": req.params.user,
        "name": req.list[0].name,
        "items": (req.body.items) ? req.body.items : false,
        "item": (req.body.item) ? req.body.item : false,
      };
      models.list_repo.write(add_options, function(err, lists) {
        if (err) return next(err);
        return next();
      });
    };
  }

  middleware.list_create_via_body = function() {
    return function(req, res, next) {
      models.list_repo.write({
        "github_user": req.session.github_user,
        "name": req.body.name,
        "items": (req.body.items) ? req.body.items : false,
        "item": (req.body.item) ? req.body.item : false
      }, function(err, lists) {
        if (err) return next(err);
        return next();
      });
    };
  }

  // stacked middleware

  middleware.logout = function() {
    return [
      middleware.param_error(),
      middleware.session_destroy(),
      middleware.redirect("/")
    ]
  }

  middleware.github_callback = function(redirect) {
    return [
      middleware.param_error(),
      middleware.github_callback_flow(),
      middleware.redirect(function(req) {
        return redirect + req.session.github_user;
      })
    ]
  }

  middleware.session = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.user_via_session_user(),
      middleware.reclusive(function(err, req, res, next) {
        return res.json({
          "loggedin": (err) ? false : true,
          "user": (req.user) ? req.user : false,
          "error": (err) ? err.message : false,
        });
      }),
    ]);
  };

  middleware.lists_read = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.lists_read_via_params(),
      function(req, res, next) {
        var names = _.pluck(req.lists, 'name');
        var lists = _.extend.apply(null, _.map(req.lists, function(list) {
          var temp = {};
          temp[list.name] = list;
          return temp;
        }));
        names.sort();
        req.lists = _.map(names, function(name) {
          return lists[name];
        });
        return next();
      },
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "lists": (!err && req.lists) ? req.lists : false,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_read = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "list": (!err && req.list) ? req.list : false,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_rename = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.session_detection_via_user(),
      middleware.list_rename_via_params_body(),
      middleware.reclusive(function(err, req, res) {
        if (!req.success) err = new Error("never ran list_rename_via_params_body");
        return res.json({
          "rename": (err || !req.success) ? false : true,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_delete = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.session_detection_via_user(),
      middleware.list_delete_via_params(),
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "delete": (err) ? false : true,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_add = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.session_detection_via_user(),
      middleware.list_add_via_params_body(),
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "add": (err) ? false : true,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_create = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.list_create_via_body(),
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "create": (err) ? false : true,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  middleware.list_remove = function() {
    return _.flatten([
      middleware.param_error(),
      middleware.session_detection(),
      middleware.session_detection_via_user(),
      middleware.list_remove_item_via_params_body(),
      middleware.reclusive(function(err, req, res) {
        return res.json({
          "removed": (err) ? false : true,
          "error": (err) ? err.message : false,
        });
      })
    ]);
  };

  return middleware;

};