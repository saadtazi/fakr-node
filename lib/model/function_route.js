var _ = require('lodash');

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
    getMiddleware: function(json) {
      var func = getMiddlewareGenerator(json.function);
      return func(json);
    }
  };
})();