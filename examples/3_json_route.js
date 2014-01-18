var fakr;
try {
  fakr = require('fakr');
} catch( err ) {
  fakr = require('../index.js');
}

// initial route
var config = {
      routes: [
        { "url": "/api/test-json-1",
          "json": {"a": "give me a string", "b": ["or", "an", "array"]},
          "method": "get",
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
  "url": "/api/test-json2/(\\d+)",
  "json": {data: [1, 2, 3, 4]},
});


// add route through api
// this example requires request

// TODO


// * run: node examples/3_json_route.js
// * open:
//   * http://localhost:3000/api/test-json-1
//   * http://localhost:3000/api/test-json2/19
