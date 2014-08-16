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
    models.users.create({
      "github_user": argv.user,
      "github_access_token": (argv.token)  ? argv.token : false,
    }, function(err, data) {
      return callback(err, data);
    });
  }
], function(err, data) {
  if (err) throw err;
  console.log(data);
  DB.close();
});