var _ = require('lodash'),

    Route = require('./route');

module.exports = (function() {
  'use strict';
  
  function getMiddlewareGenerator(func) {
    if (_.isFunction(func)) { return func; }
    /*jshint evil:true*/
    return eval('(' + func + ')');
  }

  return {
    validate: function(json) {
      try {
        getMiddlewareGenerator(json.function);
      } catch (e) {
        var error = {};
        error[e.name] = e.message;
        return error;
      }
      return true;
    },
    fromJson: function(json) {
      var func = getMiddlewareGenerator(json.function);
      return Route.fromConfig(json, func());
    }
  };
})();