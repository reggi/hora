var serveIndex = require('serve-index');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var OAuth2 = require("oauth").OAuth2;
var helpers = require("hora-helpers");

var app = express();
var github = helpers.github({
  key: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});
var oauth = new OAuth2(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
  "https://github.com/",
  "login/oauth/authorize",
  "login/oauth/access_token"
);

module.exports = function(db) {
  var models = require("hora-models")(db, github);
  var middleware = require("./middleware")(models, oauth, github);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(favicon());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(middleware.sessionStore(db));
  app.use(middleware.useLocalhost());

  //static
  app.use("/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/", express.static(path.join(__dirname, "..", 'hora-client')));

  //dymanic
  app.param('user', middleware.param_user());
  app.param('list_repos', middleware.param_list_repos());
  app.param('list', middleware.param_list());
  app.get("/github/authorize", middleware.github_login());
  app.get("/github/callback", middleware.github_callback("/#/"));
  app.get("/login", middleware.redirect("/github/authorize"));
  app.get("/logout", middleware.logout());
  app.get("/api/session.json", middleware.session());
  app.delete("/api/lists/:user/:list.json", middleware.list_delete());
  app.get("/api/lists/:user.json", middleware.lists_read());
  app.put("/api/lists/:user/:list/rename.json", middleware.list_rename());
  app.put("/api/lists/:user/:list/remove.json", middleware.list_remove());
  app.put("/api/lists/:user/:list/add.json", middleware.list_add());
  app.get("/api/lists/:user/:list_repos.json", middleware.list_read());
  app.post("/api/lists/create.json", middleware.list_create());

  app.use(middleware.error_404);
  app.use(middleware.error);
  return app;
}