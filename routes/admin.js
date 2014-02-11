var RouteBuilder = require('../model/route_builder'),
    _ = require('lodash');

module.exports = (function() {
  'use strict';
  return {
    add: function(app, prefix) {
      app.get(prefix + '/routes', function(req, res) {
        res.json({ data: app.fakrRoutes.map(function(route) {
                  return route.toJSON();
                })});
      });
      function updateRoute(req, res) {
        var route = req.body;
        app.removeRoute(route);
        app.addRoute(route);
        res.json(route);
      }
      app.post(prefix + '/routes', updateRoute);

      app.put(prefix + '/routes', updateRoute);

      app.del(prefix + '/routes', function(req, res) {
        var route = req.body;
        if (_.isEqual(route, {})) {
          app.removeAllRoutes();
        } else {
          app.removeRoute(route);
        }
        res.json(route);
      });
    }
  };
})();