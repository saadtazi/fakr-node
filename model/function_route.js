var Route = require('./route');

module.exports = {
  validate: function(json) {
    // if we are here,
    // we have a 'string' property...
    return true;
  },
  fromJson: function(json) {
    return Route.fromConfig(function(req, res) {
      res.json(json.status, json.json);
    }, json);
  }
};