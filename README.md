# NO LONGER MAINTAINED!
# fakr

[![Build Status](https://travis-ci.org/saadtazi/fakr-node.png)](https://travis-ci.org/saadtazi/fakr-node)
[![Dependency Status](https://david-dm.org/saadtazi/fakr-node.png)](https://david-dm.org/saadtazi/fakr-node)
[![Coverage Status](https://coveralls.io/repos/saadtazi/fakr-node/badge.png?branch=master)](https://coveralls.io/r/saadtazi/fakr-node?branch=master)

[![NPM](https://nodei.co/npm/fakr.png)](https://nodei.co/npm/fakr/)


Create a dynamic web server that generates static or dynamic responses based on json configuration.

Routes can be added dynamically through:

* initialization config when fakr starts,
* fakr.addRoute function if you are in the same scope
* fakr.addCrudApi function to generate CRUD REST-ish api routes automatically
* a restful-ish api.

# Usage

```
var config = require('config.json'),
    fakr = require('fakr')(config);

fakr.listen(3000, function() {
  console.log('fakr is listening on port 3000');
});
// in the same scope, you can add route
fakr.addRoute({
  "url": "/api/example/(\\d+)",
  "json": {data: [1, 2, 3, 4]},
});
```

You can also extend an existing express 4.x app (since fakr 0.2 - use version 0.1.x for express 3):

```
var express = require('express'),
    fakr    = require('fakr'),
    // config. can be {}
    config  = require('config.json');

// get an express app
var app = express();
app.get(function(req, res) {
  res.send('original route');
});

// then augment the app with fakr
fakr(config, app);

// you can now add routes dynamically

fakr.addRoute({
  "url": "/api/example/(\\d+)",
  "json": {data: [1, 2, 3, 4]},
});

```

Note that this feature does not work yet with express 4.

# Configuration

```
{
  "hasAdmin": true,
  "adminUrlPrefix": "/_admin",
  defaults: {
    "headers": [
      "status": 201,
      "headers": {
        "Expires": "Fri, 17 Jan 2014 05:25:28 GMT",
        "X-Frame-Options": "SAMEORIGIN"
      }
    ]
  },
  "routes": [
    ... see route configuration below...
  ]
}
```

# Config options

## `adminUrlPrefix`

If hasAdmin is true (see below), then adminUrl defines the API endpoint prefix url.
Default: `/_admin`.

## `hasAdmin`

If true, adds the following admin API routes:

* for managing routes:
    * one for listing routes: `GET {{adminUrlPrefix}}/routes`
    * one for creating new routes: `POST {{adminUrlPrefix}}/routes`
        * the json body should be a valid route
    * one for modifying a route: `PUT {{adminUrlPrefix}}/routes`
        * the json body should be a valid route
    * one for deleting routes through: `DELETE {{adminUrlPrefix}}/routes`
        * if the json body is not empty: the json body request should contain a url (string).
  `method` is optional (uses the config value, which defaults to `get`)
        * if the json body is empty: all routes will be removed!!
* for getting previous requests when `storeRequests` is set to `true`:
    * one for getting the previous requests: `GET {{adminUrlPrefix}}/routes`
        * the query string should represent a valid route (url, method are mandatory, isRegExp optional)

    * one for resetting the previously stored requests: `DELETE {{adminUrlPrefix}}/routes`
        * the json body should be a valid route

* for managing CRUD api routes:
    * one for listing all CRUD api routes: `GET {{adminUrlPrefix}}/api-routes`
    * one for getting one CRUD api route info: `GET {{adminUrlPrefix}}/api-routes/{{route-name}}`
    * one for creating new CRUD api routes: `POST {{adminUrlPrefix}}/api-routes`
    * one for deleting CRUD api routes through: `DELETE {{adminUrlPrefix}}/routes`

## `routes`

An array of routes that will be available when server starts.
See below how to configure routes.

Other routes can be added dynamically after the server is started.

# Route Configuration

All routes can have the following properties:

* `headers`: a list of header names/headers values, like `Content-type`...
(default: {"content-type": "application/json"}).
* `status`: http response status code (default: 200).
* `url`: the url, accepts regular expressions if isRegExp is `true`,
or expressjs url format (`/route/:id...) if it is false.
* isRegExp: tells fakr if the provided url param (as string)
should be converted into a regExp (default: false).
  * note that it has no effect if url is a js regExp object.
* `method`: http method (default: `get`)

You can also set the default values for all responses in your config,
under the `defaults` properties.

Each route type uses different properties.

* if it has a `string` property, it is a string route.
    * the `string`property should be a string.
* if it has a `template` property, it is a template route.
    * the `template` property should be a string that should be into a hogan.js template.
  The template has access to `req`, so `req.params`, `req.body` or req.
* if it has a `json` property, it is a json route.
    * the `json` property should be a valid json object.
* if it has a `function` property, it is a... guess what?
Yes, a function route.

The order of creation of routes is important: the first matching route is executed.  
Also, if a route has a `string` and a `function`property
(who would do that anyway?), fakr assumes that it is a string route.

## String Route Example

For static response.

```
{
  "url": "/api/test-string",
  "string": "this is a string",
  "method": "get",
  "header": "text/plain",
  "status": "200"
}
```

## String Route Example

For templated response, that has access to the request object property. Uses hogan.js (mustache-like)

```
{ "url": "/api/test-template/:id-:title",
  "isRegExp": false,
  "template": "* id is {{req.params.id}}\n" +
              "* title is {{req.params.title}}\n" +
              "* q is {{req.query.q}}\n",
  "method": "get"
}
```

When requesting `GET /api/test-template/1-hello?q=yo`, it will respond with:

```
* id is 1
* title is hello
* q is yo
```



## JSON Route Example

This route forces the Content Type header (relies on expressjs response.json())

```
{
  "url": "/api/test-json",
  "json": {"prop1": "value1", "tags": ["news", "koko"]},
  "method": "post",
  "status": 201
}
```

## Function Route Example

```
{
  "url": "/api/test-function/:resource",
  "method": "get",
  "function": "function(route) { return function(req, res, next) {res.send(req.params.resource); }}"
}
```

`function` can be a real function or a string to evals to a string.
It should return a middleware function (params are: req, res, next (optional)).

Why not directly the middleware function? Thanks to closure, you can do things like that:

```
function(route) {
  var nbCalls = 0;
  return function(req, res /*, next*/) {
    var text = ++nbCalls < 3 ?
                'called ' + nbCalls + ' times':
                'stop, I\'m tired.' +
                '\nid: ' + req.params.id +
                '.\ntitle: ' + req.params.id;
    res.send(text);
  };
}
```

You can also have access to the json route definition using `route`, and add extra parameter to the `route`definition
and access them in the function.

# CRUD API Routes

You can also add CRUD routes using the fakr.addCrudApi() or the admin api url.

you need to provide a `name`, which is the name of the entity you want to manage.
It will generate by default 5 routes per entity:

* `find` url: defaults to `GET /{{entity-name}}` which lists all entity instances
* `get` url: defaults to `GET /{{entity-name}}/{{ID}}` which returns one entity instance
* `add` url: defaults to `POST /{{entity-name}}`.
    * expects a json in the request body.
* `remove` url: defaults to `DELETE /{{entity-name}}/{{ID}}`
* `update` url: defaults to `PUT /{{entity-name}}/{{ID}}`
    * expects a json in the request body.


**All the data are kept in memory and is lost when you stop the express app**.

## CRUD API Configuration

To create new CRUD API, the minimum configuration is:

```
{ "name": "entities" }

// Generates the following urls:
// GET    /entities
// GET    /entities/ID
// POST   /entities
// DELETE /entities/ID
// PUT /entities/ID

//
```

But you have control on a lot of things if you need. Here is the default configuration:

```
{
  model: {
    config: { idKey: 'id',
              keyStrategy: 'autoIncrement',  // other strategy: 'guid'
              // if true, it will throw if you try to:
              // * add an existing id
              // * delete a non-existing id
              // * update a non-existing id
              detectExisting: false
            },
    initData: []  // an array of entities (POJO)
  },
  urlBase: '/{{name}}',
  routes: {
    find: {
      // each route should be a valid route as described in `route configuration` section,
      // except for the funtion url that should follow the structure below
      // (a function with param status and model that returns a function
      // that returns a function with params request et reponse... yeah... I know...)
      method: 'get',
      url: '{{urlbase}}',
      function: function(status, model) {
        return function() {
          return function(req, res) {
            res.json(status, {data: model.getAll()});
          };
        };
      }
    },
    get: {
      method: 'get',
      url: '{{urlbase}}/:id',
      function: function(status, model) {
        return function() {
          return function(req, res) {
            var item = model.findById(req.params.id);
            if (item === undefined) {
              return res.json(404, {});
            }
            res.json(status, model.findById(req.params.id));
          };
        };
      }
    },
    add: {
      method: 'post',
      url: '{{urlbase}}',
      status: 201,
      function: function(status, model) {
        return function() {
          return function(req, res) {
            res.json(status, {data: model.add(req.body) });
          };
        };
      }
    },
    remove: {
      method: 'delete',
      url: '{{urlbase}}/:id',
      function: function(status, model) {
        return function() {
          return function(req, res) {
            res.json(status, {data: model.remove(req.params.id) });
          };
        };
      }
    },
    update: {
      method: 'put',
      url: '{{urlbase}}/:id',
      function: function(status, model) {
        return function() {
          return function(req, res) {
            res.json(status, {data: model.update(req.params.id, req.body) });
          };
        };
      }
    }
  }
  }
```

In the url properties, `{{urlbase}}` and `{{name}}` are replaced by the `name` and `urlBase`.

If you don't want one of the 5 generated urls, just assign `false`to the corresponding route in the config.

# Public API

## fakr(config, app)

`config` is a json configuration, it can be null, defaults to {}.

`app` is optional. If defined, it should be an expressjs app. It will

## `app.addRoute(json)`

Adds a route defined in `json`(see [Route configuration](#route-configuration))

Note that if `fakr()` was called with an `app` param, then adding a fakr route
that match exactly a already existing app route will have no effect: the original route will match.

If 2 fakr routes have the same url and method, then the **last** defined route will overwite the first route.


## `app.removeRoute(json)`

remove a route defined in `json`. Expected `json.url`.
`json.method` (or default `method`) is used to find the route that will be deleted.

## `app.removeAllRoutes()`

remove all routes added by fakr.

If `fakr()` was called with an `app` param, then only routes added through `config`, `app.addRoute()`
or the `admin`api will be deleted.

## app.addCrudApi(config)

Adds CRUD API routes. config should contain a `name` property.
See above the **CRUD API Configuration**.

## app.removeCrudApi(name)

Removes CRUD API routes.

# Internals

In case you need to debug something...

## app.fakrRoutes

array of fakr routes (added through init config, addRoutes or api calls).

## app.fakrCrudRoutes

list of CRUD API routes. the key is the `name` of the CRUD API routes.

## app.routes

It is not added by fakr library, but it is an express property.
fakr uses it when removing routes. Helpful to debug.

# TODO

* ~~add grunt~~
* ~~add tests~~
* ~~add regExp url format support (through new RegExp()?)~~
* ~~add CRUD route type~~
* ~~add API to control routes dynamically~~
* ~~add API to control api routes dynamically~~
* add an admin UI
* add way to "prepare the future" (first call: return this once, then this 3 times, or a la sinonjs...)

#LICENSE

[MIT](./LICENSE.txt)

#CHANGELOG

## 0.2.5, 0.2.6, 0.2.7

* upgraded packages

## 0.2.4

* upgraded packages

## 0.2.3

* upgraded packages

## 0.2.2

* upgraded packages

## 0.2.1

* upgraded packages

## 0.2.0

* upgraded to express 4

## 0.1.4

* added access to `route` (json) in function route

## 0.1.1

* added simple request logger (to console)

## 0.1.0

* added crud api routes (list, get, add and delete)

## 0.0.5

* fakr can extend existing express app by adding addRoutes, admin api...

## 0.0.4

* added removeAllRoutes and corresponding /_admin/routes DELETE api (with no params!!)
* add PUT method to update a route

## 0.0.3

* fixed npm main property and hoganjs dependency
