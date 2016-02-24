# JQueryHttp

A simple wrapper for jquery's ajax that provides few convenient features.

Don't worry, it also works as a drop-in replacement for $.ajax.

## Instalation

```html
<script type="text/javascript" src="dist/jquery-http.js"></script>
```

 Bower package:
 ```
 bower install -S jquery-http
 ```

 NPM module:
 ```
 npm install --save jquery-http
 ```

## Example usage

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
      id: 5
    }
  },
  method: 'GET',
  context: this
}).then(function(response) {
  console.log(response);
}, function(err) {
  console.log(err);
});
// Will fire a request to http://mysite.com/api/v1/user/5/profile
```

or event simpler:

```javascript
http.request('GET', 'users/:id', { id: user.id }).then(function(response) {
  console.log(response);
});

http.request('POST', 'users/:id', { id: user.id }, { name: 'Ivan'} );
```

## Main features / Why would you use it?

### Setup default API endpoint and query parameters
Usually, you want to setup your API configuration only once and use it from the rest of your app - to keep things DRY. Sometimes you need to use default query params for every request, like language or token. Or you need to use and handle multiple versions of your API.

With **JQueryHttp** you can create a configured instance for all of that:

```javascript
var http = new JQueryHttp({
  defaultParams: {
    lang: 'en'
  },
  serverRoot: 'api.mysite.com',
  apiRoot: '/v1'
});
```

### URL creation helper
Sometimes you only need to generate URL for a request and you want to reuse the same configuration you defined earlier. For example, in Backbone, if you want to use integrated Backbone.sync mechanism that's performing http requests for your models and collections.  

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
What I've always hated about Jquery is their non-standard Promise implementation. This wrapper returns a native promise instead of jquery deffered promise object. If you need a good, small (Promises/A+ compliant) library to polyfill the native Promise - you can use [lie.js](https://github.com/calvinmetcalf/lie) or similar.

So, now you can do something like this:
```javascript
http.request('GET', 'users/5')
  .then(function(response) {
    console.log('We got user 5');
    return http.request('GET', 'users/5/cars');
  })
  .then(function(response) {
    console.log('We got user cars');
    return http.request('GET', 'users/5/cars/1');
  })
  .then(function(response) {
    console.log('We got car 1');
  })
  .catch(function(err) {
    console.log('We got an error:', err);
  });
```

... or this:

```javascript
Promise.all([
  http.request('GET', 'users/5'),
  http.request('GET', 'users/5/cars'),
  http.request('GET', 'users/5/cars/1')
]).then(function(responses) {
  console.log('All responses', responses);
}, function(err) {
  console.log('Error:', err);
})
```

### Loading local mock data
When developing new client-side apps, you often don't have an API ready but you want to start working on the client code. In these cases, I tend to setup mocked json responses for every future API call and instead of connecting to the server just load all the mock data from the filesystem. JQueryHttp wrapper is simplifying this process so later, when you get your API, you can just switch one configuration flag and everything works.

You would be suprised how far can you get developing your app just by using mocked data. This approach can also make the client-side testing much easier to perform.

First configure the http instance to use mock data and define root directory where mocked data is stored:
```javascript
http.setup({
  isMockMode: true,
  mockRoot: '/data/mock/'
})
```

Then write your requests just as you usually would but but add another parameter that defines the file for mock response:
```javascript
http.request({
  method: 'GET',
  url: {
    mock: 'user',
    route: '/users/:id',
    params: {
      id: 5
    }
  }
}).then(function(response) {
  console.log('We got mocked data here:', response);
});

// This will load content of /data/mock/user.json into the response
```

This also works for POST, PATCH, PUT and DELETE requests (library is always forcing GET in mock mode).

### Aborting multiple equivalent requests
There are use cases when you're doing a lot of equivalent requests and it only makes sense to complete the last one. For example, when performing a search on the client and the user types really fast. Of course, you should still use throttling (or debouncing) for keyboard event handlers but I've still found this feature very usefull.

When you try to perform a request, the last one with the same **requestKey** will be aborted if it hadn't finished yet.

You can either explictly define a **requestKey** or it will be implicitly generated from the URL. Example:

```javascript
http.request({
  method: 'GET',
  url: '/users',
  requestKey: 'users'
})
```

You can disable this behavior by doing (it's on by default):
```javascript
http.setup({
  abortEquivalentRequests: false
})
```

You can also manually abort a request with a given **requestKey** using this:
```javascript
http.abortRequest('users');
```

## API Documentation

### constructor
```javascript
// opts: object => passed to http.setup()
http = new JQueryHttp(opts);
```

#### http.setup()
Used to initialize the wrapper instance. Setup method is invoked either via constructor or manually.

Default configuration:
```javascript
http.setup({
  defaultParams: null,  // Default params for http.url() helper
  abortEquivalentRequests: true,  // Flag to enable/disable abort equivalent requests behavior
  isMockMode: false,  // Flag to enable/disable mock mode
  mockRoot: '', // A route to mock data directory
  serverRoot: '', // Server root url
  apiRoot: '' // API root prefix for urls
});
```

#### http.url()
Create URL for the request. Returns URL string.

```javascript
http.url({
  route: string, // A route string that accepts :param syntax as data placeholder
  params: object, // Params that will be injected either as route or query params
  mock: string // Path to mock file for the request
});
```

Shorter syntax:
```javascript
// route: string => 'users/:id'
// params: object (optional) => { id: 5 }
// mock: string (optional) => 'users'
http.url(route, params, mock);
```

#### http.request()
Perform a request (call to $.ajax). Returns a Promise.

```javascript
http.request({
  url: object || string, // If object - it's passed to http.url()
  requestKey: string, // Optional
  ... // all other standard $.ajax options
});
```

Shorter syntax:
```javascript
// method: string => 'GET'
// route: string => 'users/:id'
// urlParams: object (optional) => { id: 5 }
// data: object (optional) => $.ajax data (for POST request for example)
// opts: object (optional) => All other standard $.ajax options
http.request(method, route, urlParams, data, opts);
```

#### http.abortRequest()
Abort a request with the given **requestKey**.
```javascript
// requestKey: string
http.abortRequest(requestKey);
```

#### http.noConflict()
If you need to run this library in no-conflict mode just call this method in the initialization process. You will get back your old JQueryHttp object to global scope and the new one will be returned from the function call.

## Important Notes
**Browser support:** This library is using native Promise implementation so you **should** have a Promises/A+ compliant polyfill loaded if you want this to work in older browsers. Well, you should do it anyway and use promises instead of callbacks! :)

## TODOs
* Better test coverage
* Handle serverRoot, apiRoot and url route concatenation so user don't have to think about leading and trailing slashes

## Contribution
If you like this library but you think it can be improved, feel free to [open an issue](https://github.com/ilucin/jquery-http/issues/new) or [submit a pull request](https://github.com/ilucin/jquery-http/pulls). I'm open to adding new features.
