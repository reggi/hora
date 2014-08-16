module.exports = function(repo) {
  if (repo.id) {
    return {
      "repo.id": repo.id
    }
  }
  if (repo.full_name) {
    return {
      "repo.full_name": repo.full_name
    }
  }
  return false;
};