var _ = require("underscore");
var url = require("url");
var path = require("path");

module.exports = function(string_or_array) {

  var parse_github_url = function(github_url) {
    var parsed = url.parse(github_url);
    var string = parsed.path;
    string = string.replace(/\.git$/g, "");
    string = string.replace("git@github.com:", "");
    string = string.split("/");
    string = _.without(string, "");
    string = string.join("/");
    return string;
  }

  if (typeof string_or_array == "string") {
    return parse_github_url(string_or_array)
  };

  if (_.isArray(string_or_array)) {
    return _.map(string_or_array, parse_github_url);
  }

  return false;

}