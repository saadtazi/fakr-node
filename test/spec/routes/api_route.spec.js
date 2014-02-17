/*global beforeEach:false*/
describe('API-Route Admin', function() {
  'use strict';
  var customConfig = {  name: 'test-crud-custom',
                        urlBase: '/api/{{name}}',
                        model: { initData: [{ id: 10, name: 'item 10' },
                                            { id: 11, name: 'item 11' }]
                        },
                        routes: { remove: false,
                                  get: { url: '/api/get/one/:id' },
                                  update: { string: 'internal server error',
                                            status: 500
                                  }
                        }
                      };
  var app;
  beforeEach(function() {
    app = fakr();
    app.addCrudApi({
      name: 'test-crud'
    });
  });

  describe('#get api-routes', function() {
    it('should return lists of api routes', function(done) {
      supertest(app)
        .get('/_admin/api-routes')
        .expect(200)
        .end(function(err, resp) {
          if (err) { return done(err); }
          expect(resp.body).to.have.deep.property('data[0].name', 'test-crud');
          done();
        });
    });
  });

  describe('#get api-routes/:name', function() {
    it('should return one api info', function(done) {
      supertest(app)
        .get('/_admin/api-routes/test-crud')
        .expect(200)
        .end(function(err, resp) {
          if (err) { return done(err); }
          expect(resp.body).to.have.property('name', 'test-crud');
          done();
        });
    });
    it('should return 404 if name does not exist', function(done) {
      supertest(app)
        .get('/_admin/api-routes/not-a-crud')
        .expect(404, done);
    });
  });

  describe('#delete api-routes', function() {
    it('should delete api route', function(done) {
      var apptest = supertest(app);
      apptest.del('/_admin/api-routes/test-crud')
        .expect(200)
        .end(function(err, resp) {
          if (err) { return done(err); }
          apptest
            .get('/test-crud')
            .expect(404, done);
        });
    });

    it('should return 404 if name does not exist', function(done) {
      var apptest = supertest(app);
      apptest.del('/_admin/api-routes/not-a-crud')
        .expect(404, done);
    });
  });

  describe('#post api-routes', function() {
    it('should add api route', function(done) {
      var apptest = supertest(app);
      apptest
        .post('/_admin/api-routes')
        .send({ name: 'new-entities' })
        .expect(200)
        .end(function(err, resp) {
          if (err) { return done(err); }
          apptest
            .get('/new-entities')
            .expect(200, done);
        });
    });

    it('should not work if no name is provided', function(done) {
      var apptest = supertest(app);
      apptest
        .post('/_admin/api-routes')
        .send({ not_a_name: 'expects a name property' })
        .expect(500, done);
    });

    describe('when called with custom config', function() {
      beforeEach(function() {
        app = fakr();
      });

      it('should allow to customize the base URL', function(done) {
        var apptest = supertest(app);
        apptest
          .post('/_admin/api-routes')
          .send(customConfig)
          .expect(200)
          .end(function(err, resp) {
            if (err) { return done(err); }
            apptest
              .get('/api/test-crud-custom')
              .expect(200)
              .end(function(err, resp) {
                if (err) { return done(err); }
                expect(resp.body).to.have.property('data')
                  .that.deep.equal([{id: 10, name: 'item 10'}, {id: 11, name: 'item 11'}]);
                done();
              });
          });
      });

      it('should allow to remove specific urls', function(done) {
        var apptest = supertest(app);
        apptest
          .post('/_admin/api-routes')
          .send(customConfig)
          .expect(200)
          .end(function(err, resp) {
            if (err) { return done(err); }
            apptest
              .del('/_admin/api-routes/10')
              .expect(404, done);
          });
      });

      it('should allow custom url per url type', function(done) {
        var apptest = supertest(app);
        apptest
          .post('/_admin/api-routes')
          .send(customConfig)
          .expect(200)
          .end(function(err, resp) {
            if (err) { return done(err); }
            apptest
              .get('/api/get/one/11')
              .expect(200, done);
          });
      });

      it('should allow any route config type per url type', function(done) {
        var apptest = supertest(app);
        apptest
          .post('/_admin/api-routes')
          .send(customConfig)
          .expect(200)
          .end(function(err, resp) {
            if (err) { return done(err); }
            apptest
              .put('/api/test-crud-custom/11')
              .expect(500)
              .expect('internal server error', done);
          });
      });
      
    });
  });

  describe('reloading api routes from admin routes', function(done) {
    it('should work!', function(done) {
      var apptest = supertest(app),
          backup;
      apptest
        .get('/_admin/api-routes/test-crud')
        .expect(200)
        .end(function(err, resp) {
          backup = resp.body;
          apptest
            .del('/_admin/api-routes/test-crud')
            .expect(200)
            .end(function() {
              apptest
                .post('/_admin/api-routes')
                .send(backup)
                .expect(200)
                .end(function() {
                  apptest
                    .get('/test-crud')
                    .expect(200, done);
                });
            });
        });
    });
  });
});