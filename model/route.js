var _ = require('lodash');


function getUrl(url) {
  if (_.isRegExp(url)) {
    return url;
  }
  if (_.isString(url)) {
    return new RegExp(url);
  }
  return url;
}
// method, url, headers
function Route(config, action) {
  this.config   = config;
  this.method   = config.method;
  this.url      = getUrl(config.url);
  this.action   = action;
  this.headers  = config.headers || {};
  this.status   = config.status;
}

Route.getUrl = getUrl;

/**
 * @param action {Function} params are express request, express response
 *       The response should send something (res.send(), pipe(res), res.json()...)
 */
Route.fromConfig = function(config, action) {
  return new Route(config, action);
};

Route.prototype.addHeaders = function(req, res, next) {
  res.set(this.headers);
  next();
};

Route.prototype.toJSON = function() {
  var res = _.clone(this.config);
  res.url = this.url.source;
  // not clean... 
  if (this.config.function) {
    res.function = this.config.function.toString();
  }
  return res;
};

module.exports = Route;