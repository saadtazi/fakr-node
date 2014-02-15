var express = require('express'),
    app = fakr(),
    routeBuilder = require('../../../lib/model/route_builder');

describe('route_builder', function() {
  'use strict';
  describe('#add', function() {
    it('should throw if not a Route instance', function() {
      function invalid() {
        var app = routeBuilder.add(app, 'not a route object');
      }
      expect(invalid).to.throw(Error);
    });
  });

  describe('#addCrud', function() {
    it('should throw if not a Route instance', function() {
      function invalid() {
        routeBuilder.addCrud(app, {noname: 'exactly'});
      }
      expect(invalid).to.throw(Error);
    });
  });

  describe('#addCrud', function() {
    it('should throw if crud name already exists', function() {
      routeBuilder.addCrud(app, {name: 'mchicha'});
      function invalid() {
        routeBuilder.addCrud(app, {name: 'mchicha'});
      }
      expect(invalid).to.throw(Error);
    });
  });
});