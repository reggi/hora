var _ = require("underscore");
var url = require("url");
var path = require("path");

module.exports = function(string_or_array) {

  var parse_github_url = function(github_url) {
    var parsed = url.parse(github_url);
    var chunk = parsed.path.replace(/^\//g, "");
    var rid_git_ext = chunk.replace(/\.git$/g, "");
    var rid_github_proto = rid_git_ext.replace("git@github.com:", "");
    return rid_github_proto;
  }

  if (typeof string_or_array == "string") {
    return parse_github_url(string_or_array)
  };

  if (_.isArray(string_or_array)) {
    return _.map(string_or_array, parse_github_url);
  }

  return false;

}