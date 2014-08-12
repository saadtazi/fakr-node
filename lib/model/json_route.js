
module.exports = (function() {
  'use strict';
  return {
    getMiddleware: function(json) {
      return function(req, res) {
        res.status(json.status).json(json.json);
      };
    }
  };
})();