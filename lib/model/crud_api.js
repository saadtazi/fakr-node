var _ = require('lodash');

var Model = require('./crud_model'),
    Route = require('./route');

module.exports = (function() {
  'use strict';

  var defaultConfig = {
    model: {
      config: {},
      initData: []
    },
    urlBase: '/{{name}}',
    routes: {
      find: {
        method: 'get',
        url: '{{urlbase}}',
        function: function(status, model) {
          return function() {
            return function(req, res) {
              res.json(status, {data: model.getAll()});
            };
          };
        }
      },
      get: {
        method: 'get',
        url: '{{urlbase}}/:id',
        function: function(status, model) {
          return function() {
            return function(req, res) {
              var item = model.findById(req.params.id);
              if (item === undefined) {
                return res.json(404, {});
              }
              res.json(status, model.findById(req.params.id));
            };
          };
        }
      },
      add: {
        method: 'post',
        url: '{{urlbase}}',
        status: 201,
        function: function(status, model) {
          return function() {
            return function(req, res) {
              res.json(status, {data: model.add(req.body) });
            };
          };
        }
      },
      remove: {
        method: 'delete',
        url: '{{urlbase}}/:id',
        function: function(status, model) {
          return function() {
            return function(req, res) {
              res.json(status, {data: model.remove(req.params.id) });
            };
          };
        }
      },
      update: {
        method: 'put',
        url: '{{urlbase}}/:id',
        function: function(status, model) {
          return function() {
            return function(req, res) {
              res.json(status, {data: model.update(req.params.id, req.body) });
            };
          };
        }
      }
    }
  };

  var ApiRoutes = function(name, routes, model) {
    this.name = name;
    this.routes = routes;
    this.model = model;
  };

  function getMiddlewareGenerator(func) {
    if (_.isFunction(func)) { return func; }
    /*jshint evil:true*/
    return eval('(function(status, model) { return ' + func + '})');
  }

  ApiRoutes.generate = function(config) {
    var routes = {};
    config = _.merge({}, defaultConfig, config);
    var model = new Model(config.model.initData, config.model.config);
    var urlBase = config.urlBase.replace('{{name}}', config.name);
    ['find', 'get', 'add', 'remove', 'update'].forEach(function(routeType) {
      var routeConfig = config.routes[routeType];
      if (routeConfig) {
        routeConfig.url = routeConfig.url
                            .replace('{{urlbase}}', urlBase)
                            .replace('{{name}}', config.name);
        if (routeConfig.function) {
          routeConfig.function = getMiddlewareGenerator(routeConfig.function)(routeConfig.status || 200, model);
        }
        routes[routeType] = Route.generate(routeConfig);
      }
    });
    return new ApiRoutes(config.name, routes, model);
  };

  ApiRoutes.prototype.toJSON = function() {
    var results = {name: this.name, routes: {}};
    _.forEach(this.routes, function(route, routeType) {
      results.routes[routeType] = route.toJSON();
    });
    return results;
  };



  return ApiRoutes;

})();