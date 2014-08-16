module.exports = function(db) {
  var index = require("./models")(db);
  index.helpers = require("./helpers");
  return index;
}