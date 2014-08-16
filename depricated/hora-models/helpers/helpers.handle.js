module.exports = function(string) {
  return string.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}