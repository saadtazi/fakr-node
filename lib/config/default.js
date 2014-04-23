module.exports = {
  // for all routes
  "hasAdmin": true,
  "logger": false,
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