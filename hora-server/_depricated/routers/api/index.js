var express = require("express");
var router = express.Router();
var stack = require("./stacks");
module.exports = function(models) {
  router.param('user', stack.param_user(models));
  router.param('list', stack.param_list(models));
  router.get("/api/session.json", stack.session());
  //router.get("/api/list/:user.json", stack.lists_read());
  //router.get("/api/list/:user/:list.json", stack.list_read());
  //router.delete("/api/list/:user/:list.json", stack.list_delete());
  //router.put("/api/list/:user/:list.json", stack.list_update());
  //router.post("/api/list/create.json", stack.list_create());
  return router;
}