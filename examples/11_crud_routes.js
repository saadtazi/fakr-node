var mock = require('../lib/index')();

mock.addCrudApi({
  name: 'items',
  urlBase: '/api/is/here/{{name}}', // optional, default to /{{name}}
  routes: {
    create : false, // to prevent create route (POST /urlBase)
    get: {
      // method: 'delete'
      url: '/api/has/moved/HERE/:id'
    }
  },
  model: {
    initData: [ { name: 'coucou' },
                { miaw: 'bouh'   }],
    config: {
      keyStrategy: 'autoIncrement',  // it is default. (also available: "guid")
      idKey: '_id'          // defaults to 'id'
    }
  }
});
console.log(mock.routes);
mock.listen(3000);

// GET    http://127.0.0.1:3000/api/is/here/items
// GET    http://127.0.0.1:3000/api/has/moved/HERE/1
// POST   http://127.0.0.1:3000/api/is/here/items body: {}
// PUT    http://127.0.0.1:3000/api/is/here/items/1 body: {}
// DELETE http://127.0.0.1:3000/api/is/here/items/1