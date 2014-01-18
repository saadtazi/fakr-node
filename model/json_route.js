var Route = require('./route');

module.exports = {
  fromJson: function(json) {
    return Route.fromConfig(json, function(req, res) {
      res.json(json.status, json.json);
    });
  }
};