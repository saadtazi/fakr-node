var Route = require('./route');

module.exports = (function() {
  'use strict';
  return {
    getMiddleware: function(json) {
      return function(req, res) {
        res.status(json.status).send(json.string);
      };
    }
  };
})();