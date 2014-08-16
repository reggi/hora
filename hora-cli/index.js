#!/usr/bin/env node

var dotenv = require('dotenv').load();
var argv = require('minimist')(process.argv.slice(2));
var async = require("async");

var helpers = require("./helpers");
var github = helpers.github();
var global = {
  db: false,
  file: false,
  argv: argv,
  github: github
};

async.waterfall([
  helpers.database(global),
  helpers.file(global),
  require("./actions/actions.lists.write")(global)
], function(err, data) {
  if (err) throw err;
  console.log(data);
  global.db.close();
});