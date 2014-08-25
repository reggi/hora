module.exports = function(string) {
  string = string.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  string = string.replace(/^_|_$/g, "");
  return string;
}