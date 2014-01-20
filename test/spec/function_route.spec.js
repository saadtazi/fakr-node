describe('function route', function() {
  'use strict';
  it('should accept a real function', function(done) {
    var app = fakr();
    app.addRoute({  url: '/function-route-from-function',
                    function: function() {
                      var nbCalls = 0;
                      return function(req, res) {
                        nbCalls++;
                        if (nbCalls % 2 === 0) {
                          res.send(req.headers['custom-header'] + ' - odd? nbCalls = ' + nbCalls);
                        } else {
                          res.send(req.headers['custom-header'] + ' - even? nbCalls = ' + nbCalls);
                        }
                      };
                    }
                  });
    supertest(app)
      .get('/function-route-from-function')
      .set('custom-header', 'special?')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res.text).to.eql('special? - even? nbCalls = 1');
        supertest(app)
          .get('/function-route-from-function')
          .set('custom-header', 'not so special')
          .expect(200)
          .end(function(err, res) {
            if (err) { done(err); }
            expect(res.text).to.eql('not so special - odd? nbCalls = 2');
            done();
          });
      });
  });

  it('should accept a string that gets converted into a function', function(done) {
    var app = fakr();
    app.addRoute({  url: '/function-route-from-string',
                    function: 'function() {' +
                      'var nbCalls = 0;' +
                      'return function(req, res) {' +
                      '  nbCalls++;' +
                      '  if (nbCalls % 2 === 0) {' +
                      '    res.send(req.headers["custom-header"] + " - odd? nbCalls = " + nbCalls);' +
                      '  } else {' +
                      '   res.send(req.headers["custom-header"] + " - even? nbCalls = " + nbCalls);' +
                      '  }' +
                      '};}'
                  });
    supertest(app)
      .get('/function-route-from-string')
      .set('custom-header', 'special?')
      .expect(200)
      .end(function(err, res) {
        // console.log(res);
        if (err) { done(err); }
        expect(res.text).to.eql('special? - even? nbCalls = 1');
        supertest(app)
          .get('/function-route-from-string')
          .set('custom-header', 'not so special')
          .expect(200)
          .end(function(err, res) {
            if (err) { done(err); }
            expect(res.text).to.eql('not so special - odd? nbCalls = 2');
            done();
          });
      });
  });

});
