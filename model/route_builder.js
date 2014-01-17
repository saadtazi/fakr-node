/* jshint node:true */
'use strict';

var _ = require('lodash'),

    Route = require('./route'),
    stringRoute = require('./string_route'),
    jsonRoute = require('./json_route'),
    functionRoute = require('./function_route')
    ;

var routeTypes = {
      string: stringRoute,
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
    throw isValid;
  }

  return routeTypes[routeType].fromJson(json);
}

function addOne(app, route) {
  app[route.method](route.url, route.action);
}

function add(app, json) {
  var route = generate(json);
  if (_.isArray(route)) { // crud way!
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
  add: add

};