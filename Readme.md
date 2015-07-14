# jQuery HTTP

A simple wrapper for jquery's ajax!


### Example usage:

```javascript
http.request({
  url: {
    mock: 'data.json',
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
```

or event simpler:

```javascript
// GET request
http.request('GET', 'users/:id', { id: user.id }).then(function(response) {
  console.log(response);
});

// POST request
http.request('POST', 'users/:id/cars', { id: user.id }, { name: 'Honda'} );
```

### Setup default API endpoint and query parameters
TODO

### URL creation helper
TODO

### Returns Promises/A+ compliant promise instead of jquery deferred
TODO

### Loading local mock data
TODO

### Aborting multiple equivalent requests
TODO

### Notes
**Browser support:** This library is using native Promise implementation so you **should** have a Promises/A+ compliant polyfill loaded if you want this to work in older browsers. Well you should do it anyway and use promises! :)
