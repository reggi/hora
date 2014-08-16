var argv = require('minimist')(process.argv.slice(2));
var dotenv = require('dotenv').load();
var async = require("async");
var helpers = require("../helpers");

async.waterfall([

  function(callback) {
    helpers.mongodb({
      uri: process.env.MONGO_URI,
      collections: process.env.MONGO_COLLECTIONS
    }, callback);
  },
  function(db, callback) {
    var models = require("../models")(db);
    models.users.read(argv.user, function(err, data) {
      return callback(err, data, db);
    });
  }
], function(err, data, db) {
  if (err) throw err;
  console.log(data);
  db.close();
});