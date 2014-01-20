describe('json route', function() {
  'use strict';
  it('should allow to create json route', function(done) {
    // "/api/test-template2-p(\\d+)-c(\\w+)"
    var app = fakr({defaults: {headers: { 'Content-Type': 'application/json'}}});
    app.addRoute({  url: '/json-route/:p1',
                    json: {a: 1, b: 'deux'},
                  });
    supertest(app)
      .get('/json-route/it-is')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.body).to.eql({a: 1, b: 'deux'});
        done();
      });
  });

});
