var fakr;
try {
  fakr = require('fakr');
} catch( err ) {
  fakr = require('../index.js');
}

// initial route
var app = fakr({});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
app.addRoute({
  'url': '/api/test-string-removed-after-5-secs-(.*)',
  'string': 'I will be removed in 5 secs',
});

// remove route dynamically after 2 secs
setTimeout(function() {
  app.removeRoute({
    "url": '/api/test-string-removed-after-5-secs-(.*)'
  });
}, 5000);

// * run: node examples/1_string_route.js
// * quickly open:
//   * http://127.0.0.1:3000/api/test-string-removed-after-5-secs
// * refresh after 5 seconds