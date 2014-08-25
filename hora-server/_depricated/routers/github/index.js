var express = require("express");
var router = express.Router();
var middleware = require("./middleware");
module.exports = function(oauth, flows, login) {
  router.get("/github/authorize", middleware.github_login(oauth));
  router.get("/github/callback", middleware.github_callback(login));
  return router;
}