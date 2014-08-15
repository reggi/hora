var _ = require("underscore");
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("hora-helpers");


var github = helpers.github();
var globals = require("./globals.js");
var global = {
  db: false,
  file: false,
  argv: argv,
  github: github
};

var action = function() {
  var name = argv._[0] + "_" + argv._[1];
  return globals[name](global);
}

async.waterfall([
  globals.mongo(global),
  globals.file(global),
  globals.lists_write(global)
], function(err, data) {
  console.log(err);
  if (err) throw err;
  console.log(data);
  global.db.close();
});