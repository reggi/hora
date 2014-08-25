/*
  var middleware = require("./middleware/middleware.directory");

  app.get("/api/session.json", middleware.api.session());
  app.get("/api/list/:user.json", middleware.api.user_lists());
  //app.get("/api/list/:user/:list.json", middleware.api.user_list());
  //app.post("/api/list/create.json", middleware.api.list_create());
  //app.post("/api/list/rename.json", middleware.api.list_rename());
  //app.post("/api/list/remove.json", middleware.api.list_remove());
  //app.post("/api/list/item/create.json", middleware.api.item_create());
  //app.post("/api/list/item/remove.json", middleware.api.item_remove());
  //app.use(middleware.not_found());
  //app.use(middleware.error());
*/


/*


  app.use("/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/app/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/app/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/app", express.static(path.join(__dirname, "..", 'hora-client')));
  app.use("/ember/bower_components", express.static(path.join(__dirname, "..", 'bower_components')));
  app.use("/ember/bower_components", serveIndex(path.join(__dirname, "..", 'bower_components')));
  app.use("/ember", express.static(path.join(__dirname, "..", 'hora-ember')));

  //app.use(require("./routes.api"));


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


/*
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

  app.post("/api/list/update.json", function(req, res, next) {
    models.list.write({
      "name": req.body.name,
      "github_user": req.body.user,
      "item": req.body.item
    }, function(err, result) {
      console.log(err);
      console.log(result);
      if (err) return next(err);
      return res.json(result);
    });
  });

  app.post("/api/list/remove.json", function(req, res, next) {
    models.list.remove({
      "name": req.body.name,
      "github_user": req.body.user,
      "item": req.body.item,
    }, function(err, result) {
      if (err) return next(err);
      return res.json(result);
    });
  });

*/