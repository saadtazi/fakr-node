var Route = require('./route');

module.exports = (function() {
  'use strict';
  return {
    getMiddleware: function(json) {
      return function(req, res) {
        res.send(json.status, json.string);
      };
    }
  };
})();