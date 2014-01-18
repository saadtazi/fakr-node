var _ = require('lodash'),

    Route = require('./route');


function getMiddlewareGenerator(func) {
  if (_.isFunction(func)) { return func; }
  return eval('(' + func + ')');
}

module.exports = {
  validate: function(json) {
    try {
      getMiddlewareGenerator(json.function);
    } catch (e) {
      var error = {};
      error[e.name] = e.message;
      // throw e;
      return error;
    }
    return true;
  },
  fromJson: function(json) {
    var func = getMiddlewareGenerator(json.function);
    console.log('middleware::', func());
    return Route.fromConfig(json, func());
  }
};