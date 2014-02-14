var _ = require('lodash');

var Model = require('./crud_model');



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
        function: function(model) {
          return function() {
            return function(req, res) {
              res.json({data: model.getAll()});
            };
          };
        }
      },
      get: {
        method: 'get',
        url: '{{urlbase}}/:id',
        function: function(model) {
          return function() {
            return function(req, res) {
              var item = model.findById(req.params.id);
              if (item === undefined) {
                return res.json(404, {});
              }
              res.json({data: model.findById(req.params.id)});
            };
          };
        }
      },
      add: {
        method: 'post',
        url: '{{urlbase}}',
        function: function(model) {
          return function() {
            return function(req, res) {
              res.json({data: model.add(req.body) });
            };
          };
        }
      },
      remove: {
        method: 'delete',
        url: '{{urlbase}}/:id',
        function: function(model) {
          return function() {
            return function(req, res) {
              res.json({data: model.remove(req.params.id) });
            };
          };
        }
      },
      update: {
        method: 'put',
        url: '{{urlbase}}/:id',
        function: function(model) {
          return function() {
            return function(req, res) {
              res.json({data: model.update(req.params.id, req.body) });
            };
          };
        }
      }
    }
  };

  function generate(config) {
    var routes = [];
    config = _.merge({}, defaultConfig, config);
    var model = new Model(config.model.initData, config.model.config);
    var urlBase = config.urlBase.replace('{{name}}', config.name);
    ['find', 'get', 'add', 'remove', 'update'].forEach(function(routeType) {
      var routeConfig = config.routes[routeType];
      if (routeConfig) {
        routeConfig.url = routeConfig.url.replace('{{urlbase}}', urlBase);
        routeConfig.function = routeConfig.function(model);
        console.log(routeConfig);
        routes.push(routeConfig);
      }
    });
    return routes;
  }

  return {
    generate: generate
  };

})();