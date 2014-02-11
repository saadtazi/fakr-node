/* jshint node:true */
'use strict';

var _ = require('lodash'),

    Route = require('./route'),
    stringRoute = require('./string_route'),
    templateRoute = require('./template_route'),
    jsonRoute = require('./json_route'),
    functionRoute = require('./function_route')
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

function removeOne(app, json) {
  if (!json.method || !json.url) {
    throw new Error('RouteBuilder.remove: json.method and json.url are mandatory');
  }
  app.routes[json.method].forEach(function(route, index) {
    if (_.isEqual(route.path, Route.getUrl(json.url, json.isRegExp))) {
      app.routes[json.method].splice(index, 1);
    }
  });

  // remove it also from allRoutes
  app.fakrRoutes.forEach(function(route, index) {
    if (_.isEqual(route.url, Route.getUrl(json.url, json.isRegExp))) {
      app.fakrRoutes.splice(index, 1);
    }
  });
}

function removeAll(app) {
  // remove it from allRoutes
  app.fakrRoutes.forEach(function(route, index) {
    // remove it also from express routes list
    app.routes[route.method].forEach(function(expressRoute, expressIndex) {
      if (_.isEqual(expressRoute.path, Route.getUrl(route.url, route.isRegExp))) {
        app.routes[route.method].splice(expressIndex, 1);
      }
    });
    app.fakrRoutes.splice(index, 1);
  });
}

function add(app, json) {
  var route = generate(json);
  if (_.isArray(route)) { // crud is on its way!
    _.each(route, function(aRoute) {
      addOne(app, aRoute);
    });
    return;
  }
  if (route instanceof Route) {
    addOne(app, route);
    return;
  }
  throw new Error('something wrong happened');
}

module.exports = {
  generate: generate,
  add: add,
  remove: removeOne,
  removeAll: removeAll
};