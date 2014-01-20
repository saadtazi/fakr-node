describe('template route', function() {
  'use strict';
  it('should expose request object in template', function(done) {
    // "/api/test-template2-p(\\d+)-c(\\w+)"
    var app = fakr();
    app.addRoute({  url: '/template-route/:p1',
                    template: 'template route: "{{{req.headers.accept-language}}} {{{req.params.p1}}} {{{req.query.p2}}}"',
                  });
    supertest(app)
      .get('/template-route/am-not?p2=the+only+one')
      .set('Accept-Language', 'I')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.text).to.eql('template route: "I am-not the only one"');
        done();
      });
  });

});
