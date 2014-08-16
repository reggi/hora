var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("../helpers");
var DB;

async.waterfall([

  function(callback) {
    helpers.mongodb({
      uri: process.env.MONGO_URI,
      collections: process.env.MONGO_COLLECTIONS
    }, function(err, db) {
      DB = db;
      return callback(err);
    });
  },
  function(callback) {
    var models = require("../models")(DB);
    var options = {}
    if (argv.id) options.id = argv.id;
    if (argv.name) options.full_name = argv.name;
    models.repos.read(options, callback);
  }
], function(err, data) {
  if (err) throw err;
  console.log(data);
  DB.close();
});