/* global expect:false*/

// assumes default config (see config/default.js)
var tests = {
  noParamRoute: {
    method: 'get',
    definition: { url: '/test-string-1',
                  string: 'this is string 1'
                },
    expect: function(res) {
      expect(res).to.have.property('status', 200);
      expect(res.headers).to.have.property('Content-Type', 'application/json');
      expect(res).to.have.property('text', 'this is a string');
    }

  },
  // paramRoute: {

  // }
};

module.exports = tests;