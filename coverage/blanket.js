var path = require('path');
var indexFile = path.join(__dirname, '..', 'index.js');
var modelDir  = path.join(__dirname, '..', 'model');
var routesDir  = path.join(__dirname, '..', 'routes');

require('blanket')({
  // Only files that match the pattern will be instrumented
  pattern: [indexFile, modelDir, routesDir]
});