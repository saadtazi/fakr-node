var Route = require('./route');

module.exports = {
    fromJson: function(json) {
      return Route.fromConfig(function(req, res) {
        res.send(json.status, json.string);
      }, json);
    }
};