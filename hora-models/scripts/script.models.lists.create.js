//dep

/*
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
    fs.readFile(argv.file, "utf8", function(err, file) {
      if (err) return callback(err);
      var json = JSON.parse(file);
      return callback(null, json);
    });
  },
  function(file, callback) {
    var models = require("../models")(DB);
    models.lists.create(file, callback);
  }
], function(err, data) {
  if (err) throw err;
  console.log(data);
  DB.close();
});
*/