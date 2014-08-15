var _ = require("underscore");
var helpers = {};

helpers.list_write_required = [
  "github_user",
  "name"
];

helpers.list_write_defaults = {
  "rename": false,
  "overwrite": false,
  "remove": false,
  "items": [],
};

helpers.list_write_argv = function(global) {
  var argv = _.clone(global.argv);
  delete argv._;
  if (argv.user) argv.github_user = argv.user;
  delete argv.user;
  if (argv.item) argv.items = [argv.item];
  delete argv.item;
  delete argv.file;
  return argv;
}

helpers.list_write_options = function(global) {
  var argv = helpers.list_write_argv(global);
  var file = global.file;
  var defaults = helpers.list_write_defaults;
  var items = [];
  if (argv.items) items = items.concat(argv.items);
  if (file.items) items = items.concat(file.items);
  var options = {};
  _.extend(options, file);
  _.extend(options, argv);
  _.defaults(options, defaults);
  options.items = items;
  return options;
}

module.exports = helpers;