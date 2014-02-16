/* jshint node:true */
'use strict';

var _ = require('lodash'),

    Route = require('./route'),
    stringRoute = require('./string_route'),
    templateRoute = require('./template_route'),
    jsonRoute = require('./json_route'),
    functionRoute = require('./function_route'),
    crudApi = require('./crud_api')
    ;

var routeTypes = { string: stringRoute,
                   template: templateRoute,
                   json: jsonRoute,
                   function: functionRoute
    },
    types = _.keys(routeTypes);

function generate(json) {
  var isValid,
    routeType = _.find(types, function(type) {
      return json[type] !== undefined;
    });
  if (!json.url) {
    throw new Error('your route definition should contain a url property');
  }
  if (!routeType) {
    throw new Error('your route definition should contain one of the following property: ' + types.join(', '));
  }
  // if no validate function, it is valid
  isValid = routeTypes[routeType].validate ?
              routeTypes[routeType].validate(json) :
              true;
  if (isValid !== true) {
    console.error(isValid);
    throw isValid;
  }

  return routeTypes[routeType].fromJson(json);
}


function addOne(app, route) {
  app.fakrRoutes.push(route);
  app[route.method](route.url, _.bind(route.addHeaders, route), route.action);
}

function removeFromExpress(app, json) {
  app.routes[json.method].forEach(function(route, index) {
    if (_.isEqual(route.path, Route.getUrl(json.url, json.isRegExp))) {
      app.routes[json.method].splice(index, 1);
    }
  });
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
  var route = generate(json);
  if (route instanceof Route) {
    addOne(app, route);
    return;
  }
}

function addCrud(app, config) {
  if (!config.name) {
    throw new Error('addCrud: name is required');
  }
  if (app.crudRoutes[config.name]) {
    throw new Error('addCrud: name already exists');
  }
  var routes = crudApi.generate(config);
  app.crudRoutes[config.name] = routes;
  routes.forEach(function(route) {
    app.addRoute(route);
  });
}

function removeCrud(app, name) {
  var routes = app.crudRoutes[name];
  if (routes) {
    routes.forEach(function(route) {
      // remove it from express routes list
      removeFromExpress(app, route);
    });
    delete app.crudRoutes[name];
  }
}

module.exports = {
  generate  : generate,
  add       : add,
  remove    : removeOne,
  removeAll : removeAll,
  addCrud   : addCrud,
  removeCrud: removeCrud
};