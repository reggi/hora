var fs = require("fs");
var _ = require("underscore");
var dotty = require("dotty");
var path = require("path");

var requireDirObject = function(dirname, file, params) {
  dirname = path.join(dirname, file);
  var files = fs.readdirSync(dirname);
  files = _.difference(files, ["index.js", ".DS_Store", "node_modules", ".git"]);
  var result = {};
  _.each(files, function(file) {
    var file_path = path.join(dirname, file);
    var pieces = _.without(file.split("."), "js");
    var value = require(file_path);
    if (typeof value == "function" && params) value = value.apply(null, params);
    dotty.put(result, pieces, value);
  });
  return result;
};

module.exports = requireDirObject;