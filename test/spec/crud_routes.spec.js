/*global before:false, beforeEach:false*/
describe('Crud Api Routes', function() {
  'use strict';
  
  var app;

  beforeEach(function() {
    app = fakr();
    app.addCrudApi({
      name: 'entities',
      model: {
        initData: [{id: 'the-id', name: 'item'}]
      }
    });
  });

  describe('adding crud', function() {
    describe('with default param', function() {

      it('should add get (all)', function(done) {
        supertest(app)
          .get('/entities')
          .expect(200, done);
      });
      it('should add get (item)', function(done) {
        supertest(app)
          .get('/entities/the-id')
          .expect(200, done);
      });

      it('should return 404 when sending GET on an inexisting id', function(done) {
        supertest(app)
          .get('/entities/not-an-existing-id')
          .expect(404, done);
      });

      it('should add post', function(done) {
        supertest(app)
          .post('/entities')
          .send({ name: 'one entity' })
          .expect(201, done);
      });

      it('should add put', function(done) {
        supertest(app)
          .put('/entities/1')
          .send({ name: 'one entity updated' })
          .expect(200, done);
      });

      it('should add delete', function(done) {
        supertest(app)
          .del('/entities/1')
          .expect(200, done);
      });
    });

    describe('with custom params', function() {
      
      beforeEach(function() {
        app = fakr();
        app.addCrudApi({
          name: 'entities',
          urlBase: '/my/api/{{name}}',
          routes: {
            remove: false,
            get: { url: '/super/custom/url/:id' },
            update: {
              function: function(status, model) {
                return function() {
                  return function(req, res) {
                    res.send(203, {result: 'coucou'});
                  };
                };
              }
            }
          },
          model: {
            initData: [{id: 1, name: 'initial item'}]
          }
        });
      });

      it('should allow custom base url', function(done) {
        supertest(app)
          .get('/my/api/entities')
          .expect(200, done);
      });
      it('should allow to remove a verb', function(done) {
        supertest(app)
          .del('/my/api/entities/1')
          .expect(404, done);
      });
      it('should allow custom url per verb', function(done) {
        supertest(app)
          .get('/super/custom/url/1')
          .expect(200)
          .expect({id: 1, name: 'initial item'}, done);
      });

      it('should allow custom function route for a verb', function(done) {
        supertest(app)
          .put('/my/api/entities/1')
          .expect(203)
          .expect({result: 'coucou'}, done);
      });
    });
  
  });
  describe('#removeCrudApi', function() {
    describe('when removing a default params', function() {
      beforeEach(function() {
        app.removeCrudApi('entities');
      });
      it('should remove get (all)', function(done) {
        supertest(app)
          .get('/entities')
          .expect(404, done);
      });
      it('should add get (item)', function(done) {
        supertest(app)
          .get('/entities/the-id')
          .expect(404, done);
      });

      it('should remove post', function(done) {
        supertest(app)
          .post('/entities')
          .send({ name: 'one entity' })
          .expect(404, done);
      });

      it('should remove put', function(done) {
        supertest(app)
          .put('/entities/1')
          .send({ name: 'one entity updated' })
          .expect(404, done);
      });

      it('should remove delete', function(done) {
        supertest(app)
          .del('/entities/1')
          .expect(404, done);
      });
    });
  });
});