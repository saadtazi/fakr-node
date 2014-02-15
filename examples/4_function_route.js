var fakr;
try {
  fakr = require('fakr');
} catch( err ) {
  fakr = require('../lib/index.js');
}

// initial route
var config = {
      defaults: {
        headers: {
          'Content-Type': 'text/plain'
        }
      },
      routes: [
        { url: '/api/test-function/:id-:title',
          function: function() {
            var nbCalls = 0;
            return function(req, res /*, next*/) {
              var text = ++nbCalls < 3 ?
                          'called ' + nbCalls + ' times':
                          'stop, I\'m tired.' +
                          '\nid: ' + req.params.id +
                          '.\ntitle: ' + req.params.id;
              res.send(text);
            };
          },
          method: 'get'
        }
      ]
    },
    app = fakr(config);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

// add route dynamically
app.addRoute({
  url: '/api/test-function-p(\\d+)',
  function: 'function() {' +
              '  var left = 4;' +
              '  return function(req, res /*, next*/) {' +
              '    var text = "";' +
              '    if (left <= 0) { text = "Booom... I told you"; }' +
              '    else if (left === 1) { text = "Only one left... Don\'t!!!!"; }' +
              '    else { text = "calls left: " + left; };' +
              '    left--;' +
              '    res.send(text);' +
              '  };' +
              '}'
});


// add route through api
// this example requires request

// TODO


// * run: node examples/2_template_route.js
// * open:
//   * http://localhost:3000/api/test-function/1-theTitle
//   * http://127.0.0.1:3000/api/test-function-p2
//   * http://127.0.0.1:3000/api/test-function-q3