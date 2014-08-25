module.exports = function(db) {

  var helpers = require("hora-helpers");
  var _ = require("underscore");

  var items = function(options) {
    options.item = (options.item && typeof options.item == "string") ? options.item.replace(/\s+/g, "").split(",") : options.item;
    options.items = (options.items && typeof options.items == "string") ? options.items.replace(/\s+/g, "").split(",") : options.items;
    var items = [];
    if (options.item) items = items.concat(options.item);
    if (options.items) items = items.concat(options.items);
    return items;
  }

  return function(options, callback) {

    if (!options.name) return callback(new Error("missing required name"));
    if (!options.github_user) return callback(new Error("missing required github_user"));
    if (!options.overwrite) options.overwrite = false;
    if (!options.remove) options.remove = false;
    if (!options.type) options.type = "repo";

    options.items = items(options);
    options.items = helpers.parse_github_url(options.items);
    delete options.item;

    options.status = function(options) {
      if (options.delete) return "deleted"
      if (!options.status) return "active";
      return options.status;
    }(options);

    var doc = {}
    doc["$set"] = {};
    doc["$set"]["updated_at"] = new Date();
    doc["$set"]["status"] = options.status;

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

    if (!options.rename) {
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
    }

    var query = {
      "handle": helpers.handle(options.name),
      "github_user": options.github_user
    };

    var parameters = {
      "upsert": true,
      "multi": false,
    };

    return db.lists.update(query, doc, parameters, callback);

  }
}