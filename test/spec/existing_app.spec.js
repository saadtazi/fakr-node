/*global before:false, beforeEach:false*/
var express = require('express');

describe('when using an existing express app', function () {
  'use strict';

  var app;

  beforeEach(function () {
    app = express();
    app.get('/original-route', function (req, res) {
      res.send('original route');
    });
    fakr({
      routes: [{
        url: '/config-route',
        string: '"config route"'
      }]
    }, app);
  });

  it('should keep original routes', function (done) {
    supertest(app)
      .get('/original-route')
      .expect(200, done);
  });

  it('should add config routes', function (done) {
    supertest(app)
      .get('/config-route')
      .expect(200, done);
  });
  describe('when adding routes', function () {
    beforeEach(function () {
      app.addRoute({
        url: '/added-route',
        string: '"added route"'
      });
    });
    it('should allow newly created routes', function (done) {
      supertest(app)
        .get('/added-route')
        .expect(200, done);
    });

    it('should allow deletion of newly created routes', function (done) {
      app.removeRoute({
        url: '/added-route'
      });
      supertest(app)
        .get('/added-route')
        .expect(404, done);
    });

    it('should allow deletion of all created routes', function (done) {
      app.removeAllRoutes();
      supertest(app)
        .get('/added-route')
        .expect(404, done);
    });

    it('should keep original routes when removeAllRoutes() is invoked', function (done) {
      app.removeAllRoutes();
      supertest(app)
        .get('/original-route')
        .expect(200, done);
    });
  });

  describe('when overwriting original routes', function () {
    beforeEach(function () {
      app.addRoute({
        url: '/original-route',
        string: '"no longer the original response"'
      });
    });
    it('should not overwrite original routes, unfortunately (..or luckily...), so be careful :)', function (done) {
      supertest(app)
        .get('/original-route')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          expect(res.text).to.eql('original route');
          done();
        });
    });
  });

});