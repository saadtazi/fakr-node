var express = require('express'),
    _ = require('lodash'),
    adminSection = require('./routes/admin'),
    routeBuilder = require('./model/route_builder');

module.exports = function(config) {
  var app = express();
  config = _.extend(require('./config/default.js'), config || {});

  if (app.get('env') === 'development') {
    // simple logger
    app.use(function(req, res, next){
      console.log('%s %s', req.method, req.url);
      next();
    });
  }
  if (config.routes) {
    _.each(config.routes, function(route) {
      console.log('adding route::', _.extend({}, config.defaults, route));
      routeBuilder.add(app, _.extend({}, config.defaults, route));
    });
  }
  if (config.hasAdmin) {
    adminSection.addRoutes(app, config.adminUrl);
  }

  return app;

};


