var express = require('express'),
    _ = require('lodash'),
    adminRoutes = require('./routes/admin'),
    routeBuilder = require('./model/route_builder'),
    defaultConfig = require('./config/default.js');

module.exports = function(config, app) {
  'use strict';
  if (!app) {
    app = express();
    app.use(express.urlencoded());
    app.use(express.json());
  }
  config = _.merge(_.clone(defaultConfig), config || {});

  app.fakrRoutes = [];
  app.addRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    // console.log('adding route::', mergedConfig.url);
    routeBuilder.add(app, mergedConfig);
  };

  app.removeRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    // console.log('removing route::', mergedConfig.url);

    routeBuilder.remove(app, mergedConfig);
  };

  app.removeAllRoutes = function() {
    routeBuilder.removeAll(app);
  };

  app.updateRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    routeBuilder.remove(app, mergedConfig);
    routeBuilder.add(app, mergedConfig);
  };

  

  if (config.routes) {
    _.each(config.routes, function(route) {
      app.addRoute(route);
    });
  }
  if (config.hasAdmin) {
    adminRoutes.add(app, config.adminUrlPrefix);
  }
  return app;

};


