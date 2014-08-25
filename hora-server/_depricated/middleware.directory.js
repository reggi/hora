var middleware = require("./index");
var directory = {};
directory.api = {};
directory.params = {};

directory.api.session = function(models) {
  return [
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
  ]
};

directory.api.user_lists = function() {
  return [
    middleware.lists(models),
    middleware.req_json(function(req) {
      return {
        "lists": req.lists
      };
    }),
    middleware.req_json({
      "lists": false
    }, true),
  ];
},

module.exports =