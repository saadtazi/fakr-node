
module.exports = (function() {
  'use strict';
  return {
    getMiddleware: function(json) {
      return function(req, res) {
        res.json(json.status, json.json);
      };
    }
  };
})();