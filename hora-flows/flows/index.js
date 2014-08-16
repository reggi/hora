module.exports = function(oauth, models, github) {
  return {
    "login": require("./flows.login")(oauth, models, github)
  }
}