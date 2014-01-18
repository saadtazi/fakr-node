var express = require('express'),
    _ = require('lodash'),
    adminRoutes = require('./routes/admin'),
    routeBuilder = require('./model/route_builder');

module.exports = function(config) {
  var app = express();
  config = _.merge(require('./config/default.js'), config || {});

  app.fakrRoute = [];
  app.addRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    console.log('adding route::', mergedConfig.url);
    app.fakrRoute.push(routeBuilder.add(app, mergedConfig));
  };

  app.removeRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    console.log('removing route::', mergedConfig.url);

    routeBuilder.remove(app, mergedConfig);
  };

  app.use(express.bodyParser());

  if (app.get('env') === 'development') {
    // simple logger
    app.use(function(req, res, next){
      console.log('%s %s', req.method, req.url);
      next();
    });
  }
  if (config.routes) {
    _.each(config.routes, function(route) {
      app.addRoute(route);
    });
  }
  if (config.hasAdmin) {
    adminRoutes.add(app, config.adminUrlPrefix);
  }
  console.log(app.routes);
  return app;

};


