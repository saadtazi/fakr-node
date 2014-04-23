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
      // api routes (crud routes)
      app.get(prefix + '/api-routes', function(req, res) {

        var results = [];
        _.forEach(app.fakrCrudRoutes, function(apiRoutes, name) {
          results.push(apiRoutes.toJSON());
        });
        res.json({ data: results });
      });

      app.get(prefix + '/api-routes/:name', function(req, res) {
        var name = req.params.name;
        if (!app.fakrCrudRoutes[name]) {
          return res.json(404, {error: 'api route name not found'});
        }
        res.json(app.fakrCrudRoutes[name].toJSON());
      });

      app.post(prefix + '/api-routes', function(req, res) {
        var config = req.body;
        app.addCrudApi(config);
        config.routes = app.fakrCrudRoutes[config.name];
        res.json(config);
      });

      app.del(prefix + '/api-routes/:name', function(req, res) {
        var name = req.params.name;
        if (!app.fakrCrudRoutes[name]) {
          return res.json(404, {error: 'api route name not found'});
        }
        app.removeCrudApi(name);
        res.json({deleted: name});
      });
      // accumulated requests
      // expects url, method (and eventually isRegExp) in query string
      app.get(prefix + '/routes/requests', function(req, res) {
        var routeJson = req.query;
        // query params are all strings... fixing it...
        if (routeJson.isRegExp && routeJson.isRegExp === 'false') {
          routeJson.isRegExp = false;
        }
        var route = app.findRoute(routeJson);
        if (!route) {
          return res.json(404, {error: 'route not found', route: routeJson});
        }
        if (!route.shouldStoreRequests) {
          return res.json(500, {error: 'route does not store previous requests (shouldStoreRequests)', route: route});
        }
        return res.json(200, {data: route.requests});
      });
      // cleans the previous requests
      app.del(prefix + '/routes/requests', function(req, res) {
        var route = app.findRoute(req.body);
        if (!route) {
          return res.json(404, {error: 'route not found', route: req.body});
        }
        route.requests = [];
        return res.json(200, route);
      });
    }
  };
})();