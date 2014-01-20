module.exports = {
  // for all routes
  "hasAdmin": true,
  "adminUrlPrefix": "/_admin",
  "defaults": {
    "headers": {
      "Content-Type": "application/json"
    },
    "status": "200",
    "method": "get",
    "isRegExp": false
  }
};