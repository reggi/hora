module.exports = function(db, github) {
  var models = {
    "list": {
      "write": require("./models.list.write")(db)
    },
    "lists": {
      "read": require("./models.lists.read")(db)
    },
    "list_repo": {
      "write": (github) ? require("./models.list_repo.write")(db, github) : false,
      "read": (github) ? require("./models.list_repo.read")(db, github) : false,
    },
    "repo": {
      "write": require("./models.repo.write")(db),
      "read": require("./models.repo.read")(db)
    },
    "user": {
      "write": require("./models.user.write")(db),
      "read": require("./models.user.read")(db)
    }
  };
  return models;
};