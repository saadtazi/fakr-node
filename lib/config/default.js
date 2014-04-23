module.exports = {
  // for all routes
  "hasAdmin": true,
  "logger": true,
  "adminUrlPrefix": "/_admin",
  "defaults": {
    "headers": {
      "Content-Type": "application/json",
      "shouldStoreRequests": false,
    },
    "status": "200",
    "method": "get",
    "isRegExp": false
  }
};