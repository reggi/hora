var serveIndex = require('serve-index');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var OAuth2 = require("oauth").OAuth2;
var helpers = require("hora-helpers");
var github = helpers.github();
var app = express();
var oauth = new OAuth2(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, "https://github.com/", "login/oauth/authorize", "login/oauth/access_token");

module.exports = function(db) {
  var models = require("hora-models")(db, github);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      db: db.native,
    })
  }));
  app.use(function(req, res, next) {
    if (req.host == "127.0.0.1") res.redirect("http://localhost:3000" + req.path);
    return next();
  });
  app.use("/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/app/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/app/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/app", express.static(path.join(__dirname, "..", 'hora-client')));
  app.use("/ember/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/ember/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/ember", express.static(path.join(__dirname, "..", 'hora-ember')));

  var middleware = require("./middleware");
  var flows = require("hora-flows")(oauth, models, github);

  app.get('/', middleware.index());

  app.param('user', middleware.user_param(models));
  app.param('list', middleware.list_param(models));

  app.get("/login", middleware.redirect("/api/github/authorize"));
  app.get("/logout", [
    middleware.session_destroy(),
    middleware.redirect("/app")
  ]);

  app.get("/api/github/authorize", middleware.authorize(oauth));
  app.get("/api/github/callback", [
    middleware.login(flows, "/api/github/authorize"),
    middleware.redirect(function(req) {
      return "/ember/#/" + req.session.github_user
    })
  ]);

  app.get("/api/session.json", [
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
  ]);

  app.get("/api/:user/lists.json", [
    middleware.lists(models),
    middleware.req_json(function(req) {
      return {
        "lists": req.lists
      };
    }),
    middleware.req_json({
      "lists": false
    }, true),
  ]);

  app.get("/api/:user/list/:list.json", middleware.req_json(function(req) {
    return req.list;
  }));

  // require session
  // require session.github_user == :user

  app.get("/api/make.json", function(req, res, next) {
    console.log(models);
  });

  app.use(middleware.not_found());
  app.use(middleware.error());
  return app;
}

/*
app.get("/admin", function(req, res, next) {
  models.users.read("reggi", function(err, user) {
    if (err) return next(err);
    req.session.github_user = "reggi",
    req.session.access_token = user.github_access_token;
    return res.send("logged in as reggi");
  });
});
*/
//app.get("/dashboard", middleware.return_session());
//app.use("/api", middleware.api_access());