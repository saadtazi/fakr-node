# fakr

[![Build Status](https://travis-ci.org/saadtazi/fakr-node.png)](https://travis-ci.org/saadtazi/fakr-node)
[![Dependency Status](https://david-dm.org/saadtazi/fakr-node.png)](https://david-dm.org/saadtazi/fakr-node)

[![NPM](https://nodei.co/npm/fakr.png)](https://nodei.co/npm/fakr-node/)


Create a dynamic web server that generates static or dynamic responses based on json configuration.

Routes can be added dynamically through:

* initialization config when fakr starts,
* fakr.addRoute function if you are in the same scope
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

If true, adds 3 admin API routes:

* one for listing routes: `GET {{adminUrlPrefix}}/routes`
* one for creating new routes: `POST {{adminUrlPrefix}}/routes`
    * the json body should be a valid route (string, no function or regExp)
* one for deleting new routes through: `DELETE {{adminUrlPrefix}}/routes`
    * if the json body is not empty: the json body request should contain a url (string).
  `method` is optional (uses the config value, which defaults to `get`)
    * if the json body is empty: all routes will be removed!!

## `routes`

An array of routes that will be available when server starts.
See below how to configure routes.

Of course, other routes can be added dynamically after the server is started.

# Route Configuration

All routes can have the following properties:

* `headers`: a list of header names/headers values, like `Content-type`...
(default: application/json).
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
  "function": "function() { return function(req, res, next) {res.send(req.params.resource); }}"
}
```

`function` can be a real function or a string to evals to a string.
It should return a middleware function (params are: req, res, next (optional)).

Why not directly the middleware function? Thanks to closure, you can do things like that:

```
function() {
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

# TODO

* ~~add grunt~~
* ~~add tests~~
* ~~add regExp url format support (through new RegExp()?)~~
* add CRUD route type
* ~~add API to control routes dynamically~~
* add binary route types (images, pdf...)
* add an admin UI
* add a "persistence" layer (no sure there is a usecase for that...)
* add way to "prepare the future" (first call: return this once, then this 3 times, or a la sinonjs...)

#LICENSE

[MIT](./LICENSE.txt)

#CHANGELOG

## 0.0.4

* added removeAllRoutes and corresponding /_admin/routes DELETE api (with no params!!)
* add PUT method to update a route

## 0.0.3

* fixed npm main property and hoganjs dependency