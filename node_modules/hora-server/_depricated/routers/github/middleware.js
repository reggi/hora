var middleware = {}
var flows = require("hora-flows");

middleware.github_login = function(oauth) {
  return function(req, res, next) {
    var redirect_url = oauth.getAuthorizeUrl({
      redirect_uri: process.env.GITHUB_REDIRECT_URI,
      scope: process.env.GITHUB_SCOPE
    });
    return res.redirect(redirect_url);
  }
}

middleware.github_callback = function(login) {
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

module.exports = middleware;