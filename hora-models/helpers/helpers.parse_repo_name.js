var _ = require("underscore");

module.exports = function(string_or_array) {

  var parse_repo_name = function(repo_name) {
    var array = repo_name.split("/");
    var return_value = {};
    if (array[0]) return_value.user = array[0];
    if (array[1]) return_value.repo = array[1];
    return return_value;
  }

  if (typeof string_or_array == "string") {
    return parse_repo_name(string_or_array)
  };

  if (_.isArray(string_or_array)) {
    return _.map(string_or_array, parse_repo_name);
  }

  return false;

}