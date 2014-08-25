var GitHubApi = require("github");

module.exports = function(options) {
  var github = new GitHubApi({
    version: "3.0.0",
    debug: false,
    protocol: "https",
    timeout: 5000
  });
  github.authenticate({
    type: "oauth",
    key: options.key,
    secret: options.secret
  });
  return github;
};