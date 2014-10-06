describe('route creation', function () {
  'use strict';
  it('should allow route creation at init', function (done) {
    var app = fakr({
      routes: [{
        url: '/route-creation-init',
        string: '"route creation init"'
      }]
    });
    supertest(app)
      .get('/route-creation-init')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.text).to.eql('"route creation init"');
        done();
      });
  });
  it('should throw if no url property', function () {
    var app = fakr();

    function invalid() {
      app.addRoute({
        string: '"route creation anytime"'
      });
    }
    expect(invalid).to.throw();
  });

  it('should throw if invalid route type or no type', function () {
    var app = fakr();

    function invalid() {
      app.addRoute({
        url: '/no-type'
      });
    }
    expect(invalid).to.throw();
  });

  it('should allow route creation at any time', function (done) {
    var app = fakr();
    app.addRoute({
      url: '/route-creation-anytime',
      string: '"route creation anytime"'
    });
    supertest(app)
      .get('/route-creation-anytime')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.text).to.eql('"route creation anytime"');
        done();
      });
  });

  it('should allow route update at any time', function (done) {
    var app = fakr();
    app.addRoute({
      url: '/route-creation-anytime',
      string: '"route creation anytime"'
    });
    supertest(app)
      .get('/route-creation-anytime')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.text).to.eql('"route creation anytime"');

        app.updateRoute({
          url: '/route-creation-anytime',
          string: '"route modified"'
        });
        supertest(app)
          .get('/route-creation-anytime')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.text).to.eql('"route modified"');
            done();
          });
      });
  });

  it('should allow route creation through the admin API', function (done) {
    var app = fakr();
    supertest(app)
      .post('/_admin/routes')
      .send({
        url: '/route-creation-api',
        string: '"route creation api"'
      })
      .expect(200)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        supertest(app)
          .get('/route-creation-api')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              done(err);
              return;
            }
            expect(res.text).to.eql('"route creation api"');
            done();
          });
      });
  });

  it('should allow any http verb', function (done) {
    var routes = [{
      url: '/route-creationg-get',
      string: '"route creation get"',
      method: 'get'
    }, {
      url: '/route-creationg-post',
      string: '"route creation post"',
      method: 'post',
      status: 201
    }, {
      url: '/route-creationg-delete',
      string: '"route creation delete"',
      method: 'delete',
      supertestMethod: 'del'
    }, {
      url: '/route-creationg-put',
      string: '"route creation put"',
      method: 'put'
      // supertest (or superagent broken...), tries to parse json everytime...
      // }, {
      //   url: '/route-creationg-head',
      //   string: '"nothing"',
      //   method: 'head',
      //   'content-type': 'text/plain'
    }];
    var app = fakr({
        routes: routes
      }),
      testsDone = 0,
      success = 0,
      nbTests = routes.length;
    routes.forEach(function (route) {
      supertest(app)[route.supertestMethod || route.method](route.url)
        .expect(route.status || 200)
        .end(function (err, res) {
          testsDone++;
          if (err) {
            done(err);
          }
          expect(res.text).to.eql(route.string);
          success++;
          if (testsDone === nbTests && success === nbTests) {
            done();
          }
        });
    });
  });
});