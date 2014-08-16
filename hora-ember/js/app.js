App = Ember.Application.create();

App.Router.map(function() {
  this.route("list", {
    "path": "/:user/:list"
  });
  this.route("lists", {
    "path": "/:user/"
  });
});

Ember.Handlebars.registerBoundHelper('json', JSON.stringify);

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON("/api/session.json").then(function(data) {
      return data;
    });
  }
});

App.ListsRoute = Ember.Route.extend({
  model: function(params) {
    var url = ["/api/", params.user, "/", params.list, "lists.json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      return data;
    });
  }
});

App.ListRoute = Ember.Route.extend({
  model: function(params) {
    var url = ["/api/", params.user, "/list/", params.list, ".json"].join("");
    return Ember.$.getJSON(url).then(function(data) {
      return data;
    });
  }
});

/*
App.UserRoute = Ember.Route.extend({
  model: function(params) {
    var url = '/api/' + params.user + '.json';
    return Ember.$.getJSON(url).then(function(data) {
      return data;
    });
  }
});
*/