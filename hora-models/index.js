module.exports = function(db, github) {
  var index = require("./models")(db, github);
  index.helpers = require("./helpers");
  return index;
}