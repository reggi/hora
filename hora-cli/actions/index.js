module.exports = function(global) {
  return {
    "lists": {
      "write": require("./actions.lists.write.js")(global)
    }
  }
}();