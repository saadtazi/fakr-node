function Route(method, url, action, headers) {
  this.method = method;
  this.url    = url;
  this.action = action;
  this.headers = headers || {};
}

/**
 * @param action {Function} params are express request, express response
 *       The response should send something (res.send(), pipe(res), res.json()...)
 */
Route.fromConfig = function(action, config) {
  return new Route(config.method, config.url, action, config.headers);
};

Route.prototype.addHeaders = function(req, res, next) {
  console.log('headers', this.headers);
  res.set(this.headers);
  next();
}

module.exports = Route;