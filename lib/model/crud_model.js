var _    = require('lodash'),
    uuid = require('node-uuid'),

    defaultConfig = { idKey: 'id',
                      keyStrategy: 'autoIncrement',
                      // will throw if add() gets an existing id
                      detectExisting: false
                    };

module.exports = (function() {
  'use strict';
  var Model = function(data, config) {
    this.config = _.merge({}, defaultConfig, config);
    this.memoryStore = {};
    
    if (data) {
      data.forEach(this.add, this);
    }
  };

  Model.prototype.injectId = function(item) {
    var id = item.id;
    if (!id) {
      switch(this.config.keyStrategy) {
      case 'autoIncrement':
        if (!this.nextId) {
          this.nextId = 1;
        }
        id = this.nextId++;
        // add the id to the object (easier for response)
        break;
      case 'guid':
        id = uuid.v4();
        break;
      }
    }
    // in case an id is higher than 
    if (this.config.keyStrategy === 'autoIncrement' && this.nextId < id) {
      this.nextId = id + 1;
    }

    if (!id) {
      throw new Error('no id');
    }
    item[this.config.idKey] = id;
    return id;
  };

  Model.prototype.findById = function(id) {
    return this.memoryStore[id];
  };

  Model.prototype.getId = function(item) {
    return item[this.config.idKey];
  };

  Model.prototype.add = function(item) {
    if (this.config.detectExisting && this.memoryStore[this.getId(item)]) {
      throw new Error('add: id already exist (' + this.getId(item) + ')');
    }
    var id = this.injectId(item);
    this.memoryStore[id] = item;
    return item;
  };

  Model.prototype.remove = function(id) {
    if (this.config.detectExisting && !this.memoryStore[id]) {
      throw new Error('remove: id does not exist (' + id + ')');
    }
    delete this.memoryStore[id];
  };

  Model.prototype.update = function(id, properties) {
    if (this.config.detectExisting && !this.memoryStore[id]) {
      throw new Error('update: id does not exist (' + id + ')');
    }
    this.memoryStore[id] = _.merge(this.findById(id), properties);
    return this.memoryStore[id];
  };

  Model.prototype.getAll = function() {
    return _.values(this.memoryStore);
  };
  return Model;
})();