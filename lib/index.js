var express = require('express'),
    _ = require('lodash'),
    adminRoutes = require('./routes/admin'),
    routeBuilder = require('./model/route_builder'),
    defaultConfig = require('./config/default.js');

module.exports = function(config, app) {
  'use strict';

  config = _.merge(_.clone(defaultConfig), config || {});
  
  if (!app) {
    app = express();
    app.use(express.urlencoded());
    app.use(express.json());
    // simple logger
    // console.log(config);
    if (config.logger) {
      app.use(express.logger('tiny'));
    }
  }

  app.fakrRoutes = [];
  app.addRoute = function(json) {
    var mergedConfig = _.merge(_.clone(config.defaults), json);
    var routeObject = routeBuilder.add(app, mergedConfig);
    // console.log('adding route::', routeObject);
    return routeObject;
  };

  app.findRoute = function(json) {
    return routeBuilder.findFakrRoute(app, json);
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

  
  app.fakrCrudRoutes = {};
  app.addCrudApi = function(config) {
    routeBuilder.addCrud(app, config);
  };

  app.removeCrudApi = function(name) {
    routeBuilder.removeCrud(app, name);
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


