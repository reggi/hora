App = Ember.Application.create();

App.Router.map(function() {
  this.route("list", {
    "path": "/:user/:list"
  });
  this.route("lists", {
    "path": "/:user"
  });
  this.route("create", {
    "path": "/create"
  });
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON("/api/session.json").then(function(data) {
      return data;
    });
  }
});

App.CreateRoute = Ember.Route.extend({
  model: function() {

  }
});

App.ListsRoute = Ember.Route.extend({
  model: function(params) {
    var url = ["/api/lists/", params.user, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      return data;
    });
  }
});

App.ListRoute = Ember.Route.extend({
  model: function(params) {
    var url = ["/api/lists/", params.user, "/", params.list, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      return {
        params: params,
        data: data,
      }
    });
  },
  setupController: function(controller, model) {
    controller.set('model', model);
  }
});

App.ListController = Ember.ObjectController.extend({
  actions: {
    remove: function(list) {
      var model = this.get('model');
      var url = ["/api/lists/", model.params.user, "/", model.params.list, "/remove.json"].join("");
      var _this = this;
      $.ajax({
        type: "PUT",
        url: url,
        data: {
          "item": list.item
        },
        dataType: "json"
      }).done(function(data) {
        var url = ["/api/lists/", model.params.user, "/", model.params.list, ".json"].join("");
        return Ember.$.getJSON(url).then(function(data) {
          _this.set("model.data", data);
        });
      });
    },
    add: function(list) {
      var model = this.get('model');
      var _this = this;
      var url = ["/api/lists/", model.params.user, "/", model.params.list, "/add.json"].join("");
      console.log(list);
      $.ajax({
        type: "PUT",
        url: url,
        data: {
          "item": list.item
        },
        dataType: "json"
      }).done(function(data) {
        $("#add-item-field").val("");
        var url = ["/api/lists/", model.params.user, "/", model.params.list, ".json"].join("");
        return Ember.$.getJSON(url).then(function(data) {
          _this.set("model.data", data);
        });
      });
    }
  }
});

Ember.Handlebars.registerBoundHelper('json', JSON.stringify);