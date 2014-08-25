var _ = require("underscore");
var path = require("path");
var requireDirObject = require("./helpers.requireDirObject");

var absolutePath = function(file, dirname) {
  dirname = (dirname) ? dirname : __dirname;
  var isModule = false;
  if (file.charAt(0) !== ".") return file;
  var absolutePath = path.join(dirname, file);
  return absolutePath;
}

module.exports = function(dirname, object, modules) {
  dirname = (dirname) ? dirname : __dirname;
  var output = {};
  _.each(modules, function(module) {
    var _absolutePath = absolutePath(module, dirname);

    try {
      var exports = require(_absolutePath);
    } catch () {
      var exports = requireDirObject(_absolutePath);
    }

    _.extend(output, );
  })
  return output[object];
}