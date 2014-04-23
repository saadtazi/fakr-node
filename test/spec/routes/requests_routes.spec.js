describe('Previous Requests admin routes (_admin/routes/requests)', function() {
  'use strict';

  describe('#get', function() {
    it('should return 404 if the route does not exist');
    it('should return 500 if the route does not store requests');
    it('should return previous requests');
  });

  describe('#del', function() {
    it('should return 404 if the route does not exist');
    it('should clean previously stored requests');
  });
});