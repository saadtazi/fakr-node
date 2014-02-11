/*global before:false*/
describe('route removal', function() {
  'use strict';
  var app;
  before(function(done) {
    app = fakr();
    app.addRoute({ url: '/route-1',
                    string: 'route 1'
                  });
    app.addRoute({ url: '/route-2',
                    string: 'route 2',
                    method: 'post'
                  });
    supertest(app)
      .get('/route-1')
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        supertest(app)
          .post('/route-2')
          .expect(200, done);
      });
  });

  it('should allow to delete a route at any time', function(done) {
    app.removeRoute({url: '/route-1'});
    supertest(app)
      .get('/route-1')
      .expect(404, done);
      
  });

  it('should allow to delete a post route at any time', function(done) {
    app.removeRoute({url: '/route-2', method: 'post'});
    supertest(app)
      .get('/route-2')
      .expect(404, done);
      
  });

  it('should allow to delete a route through the admin API', function(done) {
    var app = fakr();
    supertest(app)
      .del('/_admin/routes')
      .send({  url: '/route-1' })
      .expect(200)
      .end(function(err, res) {
        if (err) { done(err); }
        supertest(app)
          .get('/route-1')
          .expect(404, done);
      });
  });

  it('should allow to delete all routes through the admin API', function(done) {
    var app = fakr();
    supertest(app)
      .del('/_admin/routes')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        supertest(app)
          .get('/route-1')
          .expect(404, done);
      });
  });
});