var fs = require("fs");
var _ = require("underscore");
var dotty = require("dotty");

module.exports = function(dirname) {
  dirname = (dirname) ? dirname : __dirname;
  var files = fs.readdirSync(dirname);
  files = _.difference(files, ["index.js", ".DS_Store"]);
  var result = {};
  _.each(files, function(value) {
    var pieces = _.without(value.split("."), "js");
    var value = require("./" + value);
    dotty.put(result, pieces, value);
  });
  return result;
};