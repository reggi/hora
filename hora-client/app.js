var loggedin = false;

var genHandle = function(string) {
  string = string.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  string = string.replace(/^_|_$/g, "");
  return string;
}

App = Ember.Application.create();

App.Router.map(function() {

  this.route("create");
  this.route("about");
  this.route("logout");
  this.route("login");

  this.route("index", {
    "path": "/"
  });

  this.resource('list', {
    path: "/:user/:list"
  }, function() {
    this.route('edit');
  });

  this.resource('user', {
    path: '/:user'
  }, function() {
    this.route('edit');
  });

});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {
      "lists": [{
        "name": "Cryptocurrencies",
        "user": "reggi",
        "handle": genHandle("Cryptocurrencies"),
      }, {
        "name": "Single Page Application Frameworks",
        "user": "reggi",
        "handle": genHandle("Single Page Application Frameworks"),
      }, {
        "name": "Static Site Generators",
        "user": "reggi",
        "handle": genHandle("Static Site Generators"),
      }]
    }
  }
});

App.ListRoute = Ember.Route.extend({
  model: function(params) {
    var url = ["/api/lists/", params.user, "/", params.list, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      return {
        params: params,
        list: data.list,
        loggedin: (loggedin.loggedin && loggedin.username == params.user),
        username: loggedin.username
      }
    });
  }
})

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON("/api/session.json").then(function(data) {
      if (!data.loggedin) {
        return {
          "loggedin": data.loggedin,
        };
      } else {
        loggedin = {
          "loggedin": data.loggedin,
          "username": data.user.github_user,
          "avatar": data.user.github_data.avatar_url
        }
        return loggedin;
      }
    });
  }
});

App.LogoutRoute = Ember.Route.extend({
  redirect: function() {
    window.location.replace("/logout");
  }
});

App.LoginRoute = Ember.Route.extend({
  redirect: function() {
    window.location.replace("/login");
  }
});

App.UserRoute = Ember.Route.extend({
  model: function(params, transition, queryParams) {
    var url = ["/api/lists/", params.user, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      data.username = params.user;
      data.loggedin = (loggedin.loggedin && loggedin.username == params.user);
      data.params = params;
      return data;
    });
  }
});

App.ListIndexRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    if (!model.list) {
      this.render('list/missing');
    } else if (model.list.items.length == 0) {
      this.render('list/empty');
    } else {
      this.render('list/index');
    }
  }
});

App.ListEditRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    if (!loggedin) {
      this.render('list/error');
    } else if (!model.list) {
      this.render('list/missing');
    } else
      this.render('list/edit');
  }
});

App.UserEditRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    if (model.loggedin) {
      this.render('user/edit');
    } else {
      this.render('user/error');
    }
  }
});

App.UserIndexRoute = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    if (!model.lists || model.lists.length == 0) {
      this.render("user/empty");
    } else {
      this.render("user/index");
    }
  }
});

App.ListRenameComponent = Ember.Component.extend({
  actions: {
    submit: function() {
      this.sendAction("submit", this.$(), {
        "name": this.get("name"),
        "handle": this.get("handle"),
        "user": this.get("username"),
        "transition": this.get("transition"),
      });
    }
  }
});

App.ListCreateComponent = Ember.Component.extend({
  actions: {
    submit: function(event) {
      this.sendAction("submit", this.$(), {
        "name": this.get("name")
      });
    }
  }
});

App.ListDeleteComponent = Ember.Component.extend({
  actions: {
    submit: function(event) {
      this.sendAction("submit", this.$(), {
        "handle": this.get("handle"),
        "user": this.get("username"),
        "name": this.get("name")
      });
    }
  }
});

var _listRename = function($elm, params) {
  var _this = this;
  var url = ["/api/lists/", params.user, "/", params.handle, "/rename.json"].join("");
  $elm.find("button i").addClass("fa-spin");
  $.ajax({
    type: "PUT",
    url: url,
    data: {
      "rename": params.name
    },
    dataType: "json"
  }).done(function(data) {
    $elm.find("button i").removeClass("fa-refresh").removeClass("fa-spin").addClass("fa-check");
    setTimeout(function() {
      $elm.find("button i").addClass("fa-refresh").removeClass("fa-spin").removeClass("fa-check");
    }, 1000);
    if (params.transition == "yes") _this.transitionTo("list.edit", params.user, genHandle(params.name));
  });
}

var _listDelete = function(context) {
  return function($elm, params) {
    var _this = this;
    var url = ["/api/lists/", params.user, "/", params.handle, ".json"].join("");
    $elm.find("button i").removeClass("fa-trash-o").addClass("fa-refresh").addClass("fa-spin");
    var answer = confirm('Are you sure you wanna delete the ' + params.name + " list?");
    if (!answer) {
      $elm.find("button i").addClass("fa-trash-o").removeClass("fa-refresh").removeClass("fa-spin");
      return false;
    }
    $.ajax({
      type: "DELETE",
      url: url,
      dataType: "json"
    }).done(function(data) {
      $elm.find("button i").removeClass("fa-refresh").removeClass("fa-spin").addClass("fa-check");
      setTimeout(function() {
        $elm.parent().animate({
          "height": "0px"
        }, function() {
          $(this).remove();
          if (context == "user") {
            _this.updateView(params);
          } else if (context == "list") {
            _this.transitionTo("user", params.user);
          }
        })
      }, 500);
    });
  }
}

App.UserEditController = Ember.ObjectController.extend({
  updateView: function(params) {
    var _this = this;
    var user = this.get("params.user");
    var url = ["/api/lists/", user, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      _this.set("model.lists", data.lists);
    });
  },
  actions: {
    listRename: _listRename,
    listDelete: _listDelete("user"),
    listCreate: function($elm, params) {
      var _this = this;
      $elm.find("button i").removeClass("fa-plus").addClass("fa-refresh").addClass("fa-spin");
      $.ajax({
        type: "POST",
        url: "/api/lists/create.json",
        data: {
          "name": params.name,
        },
        dataType: "json"
      }).done(function(data) {
        $elm.find("button i").removeClass("fa-refresh").removeClass("fa-spin").addClass("fa-plus");
        $elm.find("input").val("");
        _this.updateView(params);
      });
    }
  }
});

App.ListEditController = Ember.ObjectController.extend({
  updateView: function(params) {
    var _this = this;
    var url = ["/api/lists/", params.user, "/", params.handle, ".json"].join("");
    console.log(url);
    return Ember.$.getJSON(url).then(function(data) {
      _this.set("model.list", data.list);
    });
  },
  actions: {
    listRename: _listRename,
    listDelete: _listDelete("list"),
    itemCreate: function($elm, params) {
      var _this = this;
      $elm.find("button i").removeClass("fa-plus").addClass("fa-refresh").addClass("fa-spin");
      var url = ["/api/lists/", params.user, "/", params.handle, "/add.json"].join("");
      $.ajax({
        type: "PUT",
        url: url,
        data: {
          item: params.item,
        },
        dataType: "json"
      }).done(function(data) {
        $elm.find("button i").removeClass("fa-refresh").removeClass("fa-spin").addClass("fa-plus");
        $elm.find("input").val("");
        _this.updateView(params);
      });
    },
    itemDelete: function($elm, params) {
      var _this = this;
      $elm.find("button i").removeClass("fa-plus").addClass("fa-refresh").addClass("fa-spin");
      var url = ["/api/lists/", params.user, "/", params.handle, "/remove.json"].join("");
      $.ajax({
        type: "PUT",
        url: url,
        data: {
          item: params.item,
        },
        dataType: "json"
      }).done(function(data) {
        $elm.find("button i").removeClass("fa-refresh").removeClass("fa-spin").addClass("fa-plus");
        setTimeout(function() {
          var $tr = $elm.parent().parent();
          $tr.children("td").animate({
            "padding-top": 0
          }).wrapInner("<div/>").children().slideUp(function() {
            $(this).closest("tr").remove();
            _this.updateView(params);
          });
        }, 500);
      });
    }
  }
});

App.ItemCreateComponent = Ember.Component.extend({
  actions: {
    submit: function() {
      this.sendAction("submit", this.$(), {
        "handle": this.get("handle"),
        "user": this.get("username"),
        "item": this.get("item"),
      });
    }
  }
})

App.ItemDeleteComponent = Ember.Component.extend({
  actions: {
    submit: function() {
      this.sendAction("submit", this.$(), {
        "handle": this.get("handle"),
        "user": this.get("username"),
        "item": this.get("item"),
      });
    }
  }
})

Ember.Handlebars.registerBoundHelper('json', JSON.stringify);
Ember.Handlebars.registerHelper('pallet', function() {
  var colors = [
    "#4F53A3",
    "#4FA1A3",
    "#57A34F",
    "#A39B4F",
    "#9F4FA3",
    "#A34F4F"
  ];
  var color = colors[Math.floor(Math.random() * colors.length)];
  return ' style=background-color:' + color + '';
});