var _ = require("underscore");
var models = {
  "lists": {},
};

module.exports = function(db) {

  var helpers = require("hora-helpers");

  models.lists.read = function(options, callback) {
    var query = {};
    if (options.handle) query.handle = options.handle;
    if (options.github_user) query.github_user = options.github_user;
    if (!_.size(query)) return callback(new Error("no query to read list"));
    return db.lists.find(query).toArray(callback);
  }

  models.lists.write = function(options, callback) {
    if (!options.name) return callback(new Error("missing required name"));
    if (!options.github_user) return callback(new Error("missing required github_user"));
    if (!options.overwrite) options.overwrite = false;
    if (!options.remove) options.remove = false;
    if (!options.type) options.type = "repo";

    options.items = helpers.parse_github_url(options.items);

    var doc = {
      "$set": {
        "updated_at": new Date(),
      }
    }

    if (options.rename) {
      doc["$set"]["name"] = options.rename;
      doc["$set"]["handle"] = helpers.handle(options.rename);
      doc["$set"]["type"] = options.type;
      doc["$push"] = {};
      doc["$push"]["names"] = {
        "name": options.name,
        "handle": helpers.handle(options.name),
        "renamed_at": new Date(),
      };
    } else {
      doc["$setOnInsert"] = {};
      doc["$setOnInsert"]["created_at"] = new Date();
      doc["$set"]["name"] = options.name;
      doc["$set"]["handle"] = helpers.handle(options.name);
      doc["$set"]["type"] = options.type;
    }

    if (options.items) {
      if (options.remove) {
        doc["$pullAll"] = {};
        doc["$pullAll"]["items"] = options.items;
      } else if (options.overwrite) {
        doc["$set"]["items"] = {};
        doc["$set"]["items"] = options.items;
      } else {
        doc["$addToSet"] = {};
        doc["$addToSet"]["items"] = {};
        doc["$addToSet"]["items"]["$each"] = options.items;
      }
    } else {
      doc["$set"]["items"] = [];
    }

    return db.lists.update({
      "handle": helpers.handle(options.name),
      "github_user": options.github_user
    }, doc, {
      "upsert": true,
      "multi": false,
    }, callback);
  }

  return models.lists;

};