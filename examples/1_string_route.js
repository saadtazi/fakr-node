var fakr;
try {
  fakr = require('fakr');
} catch( err ) {
  fakr = require('../lib/index.js');
}

// initial route
var config = {
      routes: [
        { "url": "/api/test-string-1",
          "string": "this is a string",
          "method": "get",
          "shouldStoreRequests": true,
          "headers": {
            "Content-Type": "text/plain"
          }
        }
      ]

    },
    app = fakr(config);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

// add route dynamically
app.addRoute({
  url: '/api/test-string-2-(.*)',
  isRegExp: true,
  string: "this is another string",
});

app.addRoute({
  "url": /\/api\/test-string-reg-(.*)/,
  "isRegExp": true,
  "method": "post",
  shouldStoreRequests: true,
  string: 'this is yet another string'
});

// add route through api
// this example requires request

// TODO


// * run: node examples/1_string_route.js
// * open:
//   * http://localhost:3000/api/test-string-1
//   * http://127.0.0.1:3000/api/test-string-2-ANYTHING
//   * POST http://localhost:3000/api/test-string-reg-WHATEVER

// to get previous requests:
// * http://localhost:3000/_admin/routes/requests?url=%2Fapi%2Ftest-string-1&isRegExp=false&method=get
// * http://localhost:3000/_admin/routes/requests?url=%5C%2Fapi%5C%2Ftest-string-reg-(.*)&isRegExp=true&method=post
