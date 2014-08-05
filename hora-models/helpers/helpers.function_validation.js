var _ = require("underscore");
var dotty = require("dotty");
var Multierror = require("./helpers.multierror.js");

module.exports = function(options, argument) {
  var err = new Multierror(options.message);
  _.each(options.required, function(item) {
    var message = function() {
      if (!dotty.exists(argument, item)) return "missing " + item;
      return false;
    }()
    if (message) err.add(message);
  });
  return err.value();
}