var github = require("../establish").github;
var dotenv = require('dotenv').load();
var OAuth2 = require("oauth").OAuth2;

module.exports = function() {
  var oauth = new OAuth2(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, "https://github.com/", "login/oauth/authorize", "login/oauth/access_token");
  return oauth.getAuthorizeUrl({
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    scope: process.env.GITHUB_SCOPE
  });
}