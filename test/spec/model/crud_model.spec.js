/*global _:false, beforeEach:false*/

describe('crud model', function() {
  'use strict';

  var Model = require('../../../model/crud_model');

  describe('#constructor', function() {
    it('should allow loading of initial data', function() {
      var test = new Model(
        [{name: 'test 1'}, {name: 'test 2'}],
        {}
      );
      var allData = test.getAll();
      // autoincrement
      expect(allData).to.have.length(2);
      expect(allData).to.eql([{id: 1, name: 'test 1'}, {id: 2, name: 'test 2'}]);
    });

    it('should be able to overwrite default config', function() {
      var test = new Model(
        [{name: 'test 1'}],
        {idKey: '_id', keyStrategy: 'guid'}
      );
      var allData = test.getAll();
      // autoincrement
      expect(allData).to.have.length(1);
      expect(allData[0]).to.have.property('name', 'test 1');
      expect(allData[0]).to.have.property('_id').that.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    });
  });

  describe('#crud operations', function() {
    var modl;

    beforeEach(function() {
      modl = new Model([{name: '1'}, {name: '2'}]);
    });
    describe('#add', function() {
      it('should add the object', function() {
        modl.add({name: 'new object'});

        var allData = modl.getAll();
        expect(allData).to.have.length(3);
        expect(_.find(allData, { id: 3})).to.have.property('name', 'new object');
      });

      it('should update the object if it exists (default detectExisting: false)', function() {
        modl.add({id: 4, name: 'new object'});
        modl.add({id: 4, name: 'new object modified'});

        var allData = modl.getAll();
        console.log(_.all(allData, { id: 4} ));
        expect(_.filter(allData, { id: 4} )).to.have.length(1);
        expect(_.find(allData, { id: 4} )).to.have.property('name', 'new object modified');
      });

      it('should adjust id if stragegy is autoIncrement', function() {
        modl.add({id: 48, name: 'new object'});
        modl.add({name: 'another object'});

        var allData = modl.getAll();
        expect(_.find(allData, { id: 49})).to.have.property('name', 'another object');
      });
      it('should throw if item id already exists and config.detectExisting', function() {
        modl = new Model([], {detectExisting: true});
        modl.add({id: 4, name: 'new object'});
        function shouldThrow() {
          modl.add({id: 4, name: 'new object modified'});
        }
        expect(shouldThrow).to.throw(Error);
      });
    });
    describe('#remove', function() {
      it('should remove items if it exist', function() {
        modl.add({id: 4, name: 'new object'});
        expect(modl.getAll()).to.have.length(3);
        modl.remove(4);
        expect(modl.getAll()).to.have.length(2);

      });
      it('should not throw if item does not exist', function() {
        modl.remove(99);
        expect(modl.getAll()).to.have.length(2);
      });
      it('should throw if item id not present and config.detectExisting', function() {
        modl = new Model([], {detectExisting: true});
        function shouldThrow() {
          modl.remove(5);
        }
        expect(shouldThrow).to.throw(Error);
      });
    });
    describe('#update', function() {
      it('should update items if it exist', function() {
        modl.add({id: 4, name: 'new object'});
        modl.update(4, {name: 'new object modified'});

        var allData = modl.getAll();
        console.log(_.all(allData, { id: 4} ));
        expect(_.filter(allData, { id: 4} )).to.have.length(1);
        expect(_.find(allData, { id: 4} )).to.have.property('name', 'new object modified');
      });
      it('should add the item and not throw if item does not exist', function() {
        modl.update(999, {name: 'name'});
        expect(modl.getAll()).to.have.length(3);
      });
      it('should throw if item id not present and config.detectExisting', function() {
        modl = new Model([], {detectExisting: true});
        function shouldThrow() {
          modl.update(99, {name: 'does not exist'});
        }
        expect(shouldThrow).to.throw(Error);
      });
    });

  });
});