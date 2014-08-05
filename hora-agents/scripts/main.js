var _ = require("underscore");
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("helpers");

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
  action()
], function(err, data) {
  if (err) throw err;
  console.log(data);
  global.db.close();
});