/*global before:false, beforeEach:false*/
describe('Previous Requests admin routes (_admin/routes/requests)', function() {
  'use strict';

  var app;

  before(function() {
    app = fakr({defaults: {headers: { 'Content-Type': 'application/json'}}});
    app.addRoute({  url: '/no-request-store/:p1',
                    json: {a: 1, b: 'deux'},
                 });
    app.addRoute({  url: '/with-request-store/:p1',
                    shouldStoreRequests: true,
                    json: {a: 1, b: 'deux'},
                 });
  });

  describe('#get', function() {
    it('should return 404 if the route does not exist', function(done) {
      supertest(app)
        .get('/_admin/routes/requests?url=%2Fnot%2Fan-existing%2Froute&method=get')
        .expect(404, done);

    });
    it('should return 500 if the route does not store requests', function(done) {
      supertest(app)
        .get('/_admin/routes/requests?url=%2Fno-request-store%2F:p1&method=get')
        .expect(500, done);
    });

    it('should return previous requests', function(done) {
      var req = supertest(app);
      req
          // first, it is empty
        .get('/_admin/routes/requests?url=%2Fwith-request-store%2F:p1&method=get')
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql({data: []});
          // let's store a request
          req.get('/with-request-store/param1?query1=1&query2=value2')
            .expect(200)
            .end(function() {
              req
                // now there is one req
                .get('/_admin/routes/requests?url=%2Fwith-request-store%2F:p1&method=get')
                .expect(200)
                .end(function(err, res) {
                  expect(res.body.data).to.have.length(1);
                  expect(res.body.data[0].query).to.deep.equal({query1: '1', query2: 'value2'});
                  expect(res.body.data[0].params).to.deep.equal({p1: 'param1'});
                  done();
                });
            });
        });
    });
  });

  describe('#del', function() {
    beforeEach(function(done) {
      supertest(app)
        .get('/with-request-store/param1?query1=1&query2=value2')
        .expect(200, done);
          
    });
    it('should return 404 if the route does not exist', function(done) {
      supertest(app)
        .del('/_admin/routes/requests')
        .send({url: '/not/an-existing/route', method: 'get'})
        .expect(404, done);
    });
    it('should clean previously stored requests', function(done) {
      var req = supertest(app);

      req
        // delete previously stored requests
        .del('/_admin/routes/requests')
        .send({url: '/with-request-store/:p1', method: 'get'})
        .expect(200)
        .end(function(err, res) {
          // ask for requests
          req
            .get('/_admin/routes/requests?url=%2Fwith-request-store%2F:p1&method=get')
            .expect(200)
            .end(function(err, res) {
                
              expect(res.body).to.eql({data: []});
              done();
            });
        });
    });
  });
});