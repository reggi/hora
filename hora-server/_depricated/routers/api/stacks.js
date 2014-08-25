var _ = require("underscore");
var middleware = require("./middleware");

var stacks = {};

stacks.param_user = middleware.param_user;
stacks.param_list = middleware.param_list;

stacks.session = function() {
  var stacks = _.flatten([
    middleware.session_detection(),
    middleware.user_via_session_user(),
    middleware.reclusive(function(err, req, res, next) {
      return res.json({
        "loggedin": (err) ? false : true,
        "user": (req.user) ? req.user : false
      });
    }),
  ]);
  return stacks;
};

stacks.user_lists = function() {
  return [
    middleware.catch()
  ]
};

stacks.user_lists = function() {
  return [
    middleware.catch()
  ]
};

stacks.list_create = function() {
  return [
    middleware.catch()
  ]
};

stacks.list_rename = function() {
  return [
    middleware.catch()
  ]
};

stacks.list_remove = function() {
  return [
    middleware.catch()
  ]
};

stacks.item_create = function() {
  return [
    middleware.catch()
  ]
};

stacks.item_remove = function() {
  return [
    middleware.catch()
  ]
};

module.exports = stacks;