var MongoClient = require('mongodb').MongoClient;
var _ = require("underscore");

module.exports = function(options, callback) {
  MongoClient.connect(options.uri, function(err, db) {
    if (err) throw err;
    var mongodb = {
      "native": db,
      "close": function() {
        return db.close();
      }
    }
    var collections = options.collections.split(",");
    _.each(collections, function(collection) {
      mongodb[collection] = db.collection(collection);
    });
    return callback(err, mongodb);
  });
}