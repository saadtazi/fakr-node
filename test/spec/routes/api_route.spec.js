/*global beforeEach:false*/
describe('API-Route Admin', function() {
  'use strict';

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
    it('should delete api route', function(done) {
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

    it('should delete api route', function(done) {
      var apptest = supertest(app);
      apptest
        .post('/_admin/api-routes')
        .send({ not_a_name: 'expects a name property' })
        .expect(500, done);
    });
  });

  describe('reloading api routes from admin routes', function() {
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