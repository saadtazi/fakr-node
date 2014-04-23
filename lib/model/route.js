var _ = require('lodash'),

    stringRoute   = require('./string_route'),
    templateRoute = require('./template_route'),
    jsonRoute     = require('./json_route'),
    functionRoute = require('./function_route')
    ;

var routeTypes = { string: stringRoute,
                   template: templateRoute,
                   json: jsonRoute,
                   function: functionRoute
    },
    types = _.keys(routeTypes);

module.exports = (function () {
  'use strict';
  
  function getUrl(url, isRegExp) {
    if (_.isRegExp(url)) {
      return url;
    }
    if (_.isString(url) && isRegExp) {
      return new RegExp(url);
    }
    return url;
  }
  // method, url, headers
  function Route(config, action) {
    this.config   = config;
    this.method   = config.method;
    this.url      = getUrl(config.url, config.isRegExp);
    this.action   = action;
    this.headers  = config.headers || {};
    this.status   = config.status;
    this.isRegExp = config.isRegExp;

    this.shouldStoreRequests = config.shouldStoreRequests;
    this.requests = [];

  }

  Route.getUrl = getUrl;

  Route.prototype.storeRequest = function(req, res, next) {
    if (this.shouldStoreRequests) {
      console.log('keeping req');
      this.requests.push({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });
    } else {
      console.log('not keeping req');
    }
    next();
  };

  Route.prototype.addHeaders = function(req, res, next) {
    res.set(this.headers);
    next();
  };


  Route.prototype.toJSON = function() {
    var res = _.clone(this.config);
    res.url = this.config.isRegExp ? this.url.source : this.url;
    // not clean... 
    if (this.config.function) {
      res.function = this.config.function.toString();
    }
    return res;
  };

  Route.generate = function(json) {
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
      // console.error(isValid);
      throw isValid;
    }
    return new Route(json, routeTypes[routeType].getMiddleware(json));
  };

  Route.stringRoute   = stringRoute;
  Route.templateRoute = templateRoute;
  Route.jsonRoute     = jsonRoute;
  Route.functionRoute = functionRoute;

  return Route;
})();