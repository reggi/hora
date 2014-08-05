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
    if (!argv.file) return callback(null, null);
    fs.readFile(argv.file, "utf8", function(err, file) {
      if (err) return callback(err);
      var json = JSON.parse(file);
      if (argv.overwrite) json.overwrite = true;
      if (!json.items) json.items = [];
      if (argv.append) json.items = json.items.concat(argv.append.split(","));
      return callback(null, json);
    });
  },
  function(json, callback) {
    if (json) return callback(null, json);
    json = {
      "github_user": argv.user,
      "name": argv.name,
      "rename": (argv.rename) ? argv.rename : false,
      "overwrite": (argv.overwrite) ? argv.overwrite : false,
      "remove": (argv.remove) ? argv.remove : false,
    };
    if (argv.item) {
      json.items = [];
      json.items.push(argv.item);
    }
    return callback(null, json)
  },
  function(list, callback) {
    var models = require("../models")(DB);
    models.lists.write(list, callback);
  }
], function(err, data) {
  if (err) throw err;
  console.log(data);
  DB.close();
});