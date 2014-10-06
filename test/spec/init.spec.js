/*global fakr:false,expect:false*/

describe('init configuration', function () {
  'use strict';
  var app;
  it('should not throw if no config is provided', function (done) {
    function init() {
      app = fakr();
    }
    expect(init).to.not.throw();

    supertest(app)
      .get('/whatever')
      .end(function (err, res) {
        expect(res).to.have.property('status', 404);
        done();
      });
  });

  describe('#default config', function () {


    it('should allow admin access through /_admin/routes', function (done) {
      app = fakr({});
      supertest(app)
        .get('/_admin/routes')
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res).to.have.property('status', 200);
          expect(res.headers['content-type']).to.contain('application/json');
          expect(res.body).to.eql({
            data: []
          });
          done();
        });
    });

    it('should return default response config', function (done) {
      app = fakr({
        routes: [{
          url: '/test-default-config',
          string: '"test default config"'
        }]
      });

      supertest(app)
        .get('/test-default-config')
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res).to.have.property('status', 200);
          expect(res.headers['content-type']).to.contain('application/json');
          done();
        });
    });
  });

  describe('#custom config', function (done) {
    it('should be able to change the admin url prefix', function () {
      app = fakr({
        adminUrlPrefix: '/custom-admin',
        routes: [{
          url: '/test-custom-config',
          string: '"test custom config"'
        }]
      });
      supertest(app)
        .get('/custom-admin/routes')
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res).to.have.property('status', 200);
          expect(res.headers['content-type']).to.contain('application/json');

          supertest(app)
            .get('/_admin')
            .expect(404, done);
        });
    });

    it('should be able to disable the admin API', function () {
      app = fakr({
        hasAdmin: false,
        routes: [{
          url: '/test-custom-config',
          string: '"test custom config"'
        }]
      });
      var req = supertest(app);

      req.get('/_admin')
        .expect(404);
    });
  });
});