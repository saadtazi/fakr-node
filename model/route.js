function Route(method, url, action, header) {
  this.method = method;
  this.url    = url;
  this.action = action;
}

Route.fromConfig = function(action, config) {
  return new Route(config.method, config.url, action);
};

module.exports = Route;