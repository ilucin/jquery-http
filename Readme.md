# jQuery HTTP

A simple wrapper for jquery's ajax that provides few convenient features.

It works as a drop-in replacement for $.ajax.

## Instalation

```html
<script type="text/javascript" src="dist/jquery-http.js"></script>
```

 Bower package:
 ```javascript
 bower install -S jquery-http
 ```

## Example usage:

First instantiate and setup your http wrapper:
```javascript
var http = new JQueryHttp({
  serverRoot: 'http://mysite.com',
  apiRoot: '/api/v1/'
});
```

... and then perform a request to some API route:

```javascript
http.request({
  url: {
    route: 'user/:id/profile',
    params: {
      id: user.id
    }
  },
  method: 'GET',
  context: this
}).then(function(response) {
  console.log(response);
}, function(err) {
  console.log(err);
});
// Will fire a request to http://mysite.com/api/v1/user/:id/profile
```

or event simpler:

```javascript
http.request('GET', 'users/:id', { id: user.id }).then(function(response) {
  console.log(response);
});

http.request('POST', 'users/:id', { id: user.id }, { name: 'Ivan'} );
```

## Plugin features

### Setup default API endpoint and query parameters
Usually, you want to setup your API configuration only once and use it from the rest of your app - to keep things DRY. Sometimes you need to use default query params for every request, like language or token. Or you need to use and handle multiple versions of your API.

With **JQueryHttp** you can create a configured instance for all of that:

```javascript
http.setup({
  defaultParams: {
    lang: 'en'
  },
  serverRoot: 'api.mysite.com',
  apiRoot: '/v1'
});
```

### URL creation helper
Sometimes you only need to generate URL for a request and you want to use the same configuration you defined earlier.

```javascript
http.url({
  route: 'users/:id/cars'
  params: {
    id: '5'
  }
});
// ==> 'api.mysite.com/v1/users/5/cars'
```

URL helper supports convenient ":param" syntax for injecting parameters.

### Returns Promises/A+ compliant promise instead of jquery deferred
What I've always hated about Jquery is their non-standard Promise implementation. This wrapper returns Promises/A+ compliant promise instead of jquery deffered promise object.

### Loading local mock data
TODO

### Aborting multiple equivalent requests
TODO

## API Documentation

#### http.setup()


## Important Notes
**Browser support:** This library is using native Promise implementation so you **should** have a Promises/A+ compliant polyfill loaded if you want this to work in older browsers. Well you should do it anyway and use promises! :)
