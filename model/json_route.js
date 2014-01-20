var Route = require('./route');

module.exports = (function() {
  'use strict';
  return {
    fromJson: function(json) {
      return Route.fromConfig(json, function(req, res) {
        res.json(json.status, json.json);
      });
    }
  };
})();