# fakr

(name might change)

Create a dynamic web server that generate static or dynamic responses based on json json configuration.

Routes can be added ~soon -> dynamically and~ at startup.

# Usage

```
var config = require('config.json'),
    fakr = require('fakr')(config);

fakr.listen(3000, function() {
  console.log('fakr is listening on port 3000');
});
``

# Example of Configuration 

```
{
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
    {
      "url": "/api/test-string",
      "string": "this is a string",
      "method": "get",
      "header": "text/plain"
    },
    {
      "url": "/api/test-json",
      "json": {"prop1": "value1", "tags": ["news", "koko"]},
      "method": "get",
      "header": "application/json"
    },
    {
      "url": "/api/test-function/:resource",
      "method": "get",
      "function": "res.send(req.params.resource)"
    },
    {
      "url": "/api/test-not-found",
      "method": "get",
      "string": "Nonono...",
      "status": 404
    }
  ]
}
```

# Route Definition

All routes can have the following properties:

* headers: a list of header names/headers values, like `Content-type`# ...
Note that the default content type header value is application/json.
* status: http response status code (default: 200)
* url: the url, in an expressjs string format (no regexp for now)
* method: http method (default: `get`)

You can also set the default values for all responses in your config,
under the `defaults.headers` properties.

The route type is defined by some properties. 

1. if it has a 'string' property, it is a string route,
2. if it has a 'json' property, it is a json route,
3. if it has a 'function' property, it is a... guess what?
Yes, a function route.

The order of the list is important: if a route has a `string` and a `function`property
(who would do that anyway?), fakr assumes that it is a string route.

## String Route Example

```
{
  "url": "/api/test-string",
  "string": "this is a string",
  "method": "get",
  "header": "text/plain",
  "status": "200"
}
```

## JSON Route Example

```
{
  "url": "/api/test-json",
  "json": {"prop1": "value1", "tags": ["news", "koko"]},
  "method": "post",
  "headers": {
    "Content-Type": "application/json"
  },
  "status": 201
}
```

## Function Route Example

```
{
  "url": "/api/test-function/:resource",
  "method": "get",
  "function": "res.send(req.params.resource)"
}
```

# TODO

* add tests
* add regExp url format support (through new RegExp()?)
* add CRUD route type
* add API to control routes dynamically
* add binary route types (images, pdf...)
* add an admin UI
* add a "persistence" layer (no sure there is a usecase for that...)
* add way to "prepare the future" (first call: return this once, then this 3 times, or a la sinonjs...)

#LICENSE

[MIT](./LICENSE.txt)
