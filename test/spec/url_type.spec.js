describe('url type', function() {
  'use strict';
  it('should default to string url format with params', function(done) {
    var app = fakr();
    app.addRoute({ url: '/route-with-params-:p1/:p2/:p3',
                    template: 'route with params "{{{req.params.p1}}} {{{req.params.p2}}} {{{req.params.p3}}}"',
                    isRegExp: false // default
                  });
    supertest(app)
      .get('/route-with-params-oh/yeah/baby')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.text).to.eql('route with params "oh yeah baby"');
        done();
      });
  });

  it('should accept regular expression', function(done) {
    var app = fakr();
    app.addRoute({ url: /\/route-with-reg-exp-(\d+)\/(\w+)\/(\w+)/,
                    template: 'route with params "{{{req.params.0}}} {{{req.params.1}}} {{{req.params.2}}}"',
                    isRegExp: false // default
                  });
    supertest(app)
      .get('/route-with-reg-exp-22/yeah/baby')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.text).to.eql('route with params "22 yeah baby"');
        done();
      });
  });

  it('should accept string that gets converted into regExp if isRegExp property is true', function(done) {
    // "/api/test-template2-p(\\d+)-c(\\w+)"
    var app = fakr();
    app.addRoute({  url: '/route-with-string-regexp-(\\d+)\/(\\w+)\/(\\w+)',
                    template: 'route with params "{{{req.params.0}}} {{{req.params.1}}} {{{req.params.2}}}"',
                    isRegExp: true
                  });
    supertest(app)
      .get('/route-with-string-regexp-55/yeah/man')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.text).to.eql('route with params "55 yeah man"');
        done();
      });
  });
});