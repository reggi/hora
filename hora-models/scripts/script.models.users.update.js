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
    var options = {
      "github_user": argv.user,
    };
    if (argv.token) options.github_access_token = argv.github_access_token;
    if (argv.status) options.status = argv.status;
    models.users.update(options, function(err, data) {
      return callback(err, data, db);
    });
  }
], function(err, data, db) {
  if (err) throw err;
  console.log(data);
  db.close();
});