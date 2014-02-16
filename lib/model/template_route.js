var hogan = require('hogan.js'),
    Route = require('./route');

module.exports = (function() {
  'use strict';

  return {
    fromJson: function(json) {
      var template = hogan.compile(json.template);
      return Route.fromConfig(json, function(req, res) {
        res.send(json.status, template.render({req: req}));
      });
    }
  };
})();