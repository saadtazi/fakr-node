var fakr;
try {
  fakr = require('fakr');
} catch( err ) {
  fakr = require('../index.js');
}

// initial route
var config = {
      defaults: {
        headers: {
          "Content-Type": "text/plain"
        }
      },
      routes: [
        { "url": "/api/test-template/:id-:title",
          "isRegExp": false,
          "template": "* id is {{req.params.id}}\n" +
                      "* title is {{req.params.title}}\n" +
                      "* q is {{req.query.q}}\n",
          "method": "get"
        }
      ]

    },
    app = fakr(config);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

// add route dynamically
app.addRoute({
  "url": "/api/test-template2-p(\\d+)-c(\\w+)",
  "template": "param 0 is {{{req.params.0}}} // param 1 is {{{req.params.1}}} // ",
});
console.log(app.routes);

// add route through api
// this example requires request

// TODO


// * run: node examples/2_template_route.js
// * open:
//   * http://localhost:3000/api/test-template/zeId-zeTitle?q=zeQuery
//   * http://127.0.0.1:3000/api/test-template2-p11-cwWw