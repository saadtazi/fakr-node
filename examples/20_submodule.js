'use strict';

var express = require('express'),
    fakrr;

try {
  fakrr = require('fakr');
} catch( err ) {
  fakrr = require('../lib/index.js');
}

var app = express(),
    mock = fakrr({ routes: [{ url: '/api/test-string-1',
                              string: 'this is a string',
                              method: 'get',
                              headers: { 'Content-Type': 'text/plain' }
                            }
                          ]
    });

// using submodule (middleware)
app.use(mock);

app.get('/from-app', function(req, res) { res.send('yep'); });

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

// add route dynamically
// you have to use
mock.addRoute({
  url:      '/api/test-string-2-(.*)',
  isRegExp: true,
  string:  'this is another string'
});
