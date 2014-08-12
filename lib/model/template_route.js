var hogan = require('hogan.js'),
    Route = require('./route');

module.exports = (function() {
  'use strict';

  return {
    getMiddleware: function(json) {
      var template = hogan.compile(json.template);
      return function(req, res) {
        res.status(json.status).send(template.render({req: req}));
      };
    }
  };
})();