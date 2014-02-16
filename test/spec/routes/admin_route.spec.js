describe('Admin Route', function() {
  'use strict';

  describe('#get', function() {
    it('should return function route to valid json (string)', function(done) {
      var app = fakr();
      app.addRoute({
        url: 'test-function',
        function: function() {
          return function(req, res) {
            res.send('coucou');
          };
        }
      });

      supertest(app)
        .get('/_admin/routes')
        .expect(200)
        .end(function(err, resp) {
          if (err) {
            return done(err);
          }
          expect(resp.body).to.have.deep.property('data[0].function').that.is.a('string');
          done();
        });
    });
  });
});