/* jshint node:true */
'use strict';

var _ = require('lodash'),

    Route    = require('./route'),
    ApiRoute = require('./crud_api');

function addToExpress(app, route) {
  app[route.method](route.url, _.bind(route.storeRequest, route), _.bind(route.addHeaders, route), route.action);
}

function addOne(app, route) {
  app.fakrRoutes.push(route);
  addToExpress(app, route);
}


function removeFromExpress(app, json) {
  // the hackish part!
  app._router.stack.forEach(function(route, index) {
    if (route.route && (route.regexp === json.url || route.route.path === json.url) && route.route.methods[json.method] === true) {
      app._router.stack.splice(index, 1);
    }
  });
}

function findFakrRoute(app, json) {
  var found = null;
  _.each(app.fakrRoutes, function(route, index) {
    if (_.isEqual(route.url, Route.getUrl(json.url, json.isRegExp)) && route.method === json.method) {
      found = app.fakrRoutes[index];
      return false;
    }
  });
  return found;
}

function removeOne(app, json) {
  if (!json.method || !json.url) {
    throw new Error('RouteBuilder.remove: json.method and json.url are mandatory');
  }
  removeFromExpress(app, json);

  // remove it also from fakrRoutes
  app.fakrRoutes.forEach(function(route, index) {
    if (_.isEqual(route.url, Route.getUrl(json.url, json.isRegExp))) {
      app.fakrRoutes.splice(index, 1);
    }
  });
}

function removeAll(app) {
  // remove it from allRoutes
  app.fakrRoutes.forEach(function(route, index) {
    // remove it from express routes list
    removeFromExpress(app, route);
  });
  app.fakrRoutes = [];
}

function add(app, json) {
  var route = Route.generate(json);
  if (route instanceof Route) {
    addOne(app, route);
  }
  return route;
}

function addCrud(app, config) {
  if (!config.name) {
    throw new Error('addCrud: name is required');
  }
  if (app.fakrCrudRoutes[config.name]) {
    throw new Error('addCrud: name already exists');
  }
  var apiRoutes = ApiRoute.generate(config);
  app.fakrCrudRoutes[config.name] = apiRoutes;
  _.forEach(apiRoutes.routes, function(route) {
    addToExpress(app, route);
  });
}

function removeCrud(app, name) {
  var apiRoutes = app.fakrCrudRoutes[name];
  if (apiRoutes) {
    _.forEach(apiRoutes.routes, function(route) {
      // remove it from express routes list
      removeFromExpress(app, route);
    });
    delete app.fakrCrudRoutes[name];
  }
}

module.exports = {
  add       : add,
  remove    : removeOne,
  removeAll : removeAll,
  addCrud   : addCrud,
  removeCrud: removeCrud,
  findFakrRoute: findFakrRoute
};