var mock = require('../../index.js')(require('../fixtures/simple.json'));

mock.listen(3000, function() {
  console.log('Listening on port 3000');
});