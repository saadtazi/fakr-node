var RouteBuilder = require('../model/route_builder');

module.exports = {
  add: function(app, prefix) {
    app.get(prefix + '/routes', function(req, res) {
      res.json({ data: app.fakrRoutes.map(function(route) {
                return route.toJSON();
      })});
    });

    app.post(prefix + '/routes', function(req, res) {
      var route = req.body;
      app.removeRoute(route);
      app.addRoute(route);
      res.json(route);
    });

    app.del(prefix + '/routes', function(req, res) {
      var route = req.body;
      app.removeRoute(route);
      res.json(route);
    });
  }
};