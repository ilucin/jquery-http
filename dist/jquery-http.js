(function() {
  'use strict';

  var _ = {
    defaults: function(obj, data) {
      for (var key in data) {
        if (!obj[key]) {
          obj[key] = data[key];
        }
      }
      return obj;
    }
  };

  var activeRequests = {};
  var config = {
    defaultParams: null,
    isMockMode: false,
    mockRoot: '',
    serverRoot: '',
    apiRoot: ''
  };

  function setup(opts) {
    for (var key in opts) {
      config[key] = opts[key];
    }
  }

  function createUrl(opts) {
    var url, route, urlParams;

    opts = opts || {};

    if (!opts.noDefaultParams) {
      opts.params = _.defaults(opts.params || {}, config.defaultParams);
    }

    if (opts.mock && config.isMockMode) {
      url = config.mockRoot + '/' + opts.mock + (opts.mock.indexOf('.json') >= 0 ? '' : '.json');
    } else {
      route = opts.route;
      urlParams = [];

      for (var key in opts.params) {
        if (route.indexOf(':' + key) >= 0) {
          route = route.replace(':' + key, opts.params[key]);
        } else {
          urlParams.push(key + '=' + opts.params[key]);
        }
      }

      url = config.serverRoot + config.apiRoot + '/' + route + (urlParams.length > 0 ? '?' + urlParams.join('&') : '');
    }

    return url;
  }

  function createRequestKey(opts) {
    return opts.requestKey || opts.url;
  }

  function httpRequest(opts) {
    if (typeof opts.url === 'object') {
      opts.url = createUrl(opts.url);
    }

    if (opts.requestKey) {
      abortRequest(opts.requestKey);
    }

    // Force GET when in mock mode
    if (config.isMockMode) {
      opts.method = 'GET';
    }

    return new Promise(function(resolve, reject) {
      var xhr = $.ajax(_.defaults({
        complete: function() {
          if (opts.requestKey && activeRequests[opts.requestKey]) {
            delete activeRequests[opts.requestKey];
          }
          if (opts.complete) {
            opts.complete.apply(opts.context || this, arguments);
          }
        },
        success: resolve,
        error: reject
      }, opts));

      activeRequests[createRequestKey(opts)] = xhr;
    });
  }

  function abortRequest(requestKey) {
    if (activeRequests && activeRequests[requestKey]) {
      console.log('Aborting request with same key:', requestKey);
      activeRequests[requestKey].abort();
      activeRequests[requestKey] = undefined;
    }
  }

  var request = function(method, route, params, data) {
    if (arguments.length === 1) {
      return httpRequest.apply(this, arguments);
    } else {
      return httpRequest.call(this, {
        url: {
          route: route,
          params: params
        },
        method: method,
        data: data
      });
    }
  };

  var url = function(route, params, mock) {
    if (arguments.length === 1) {
      return createUrl.apply(this, arguments);
    } else {
      return createUrl.call(this, {
        route: route,
        params: params,
        mock: mock
      });
    }
  };

  var http = {
    setup: setup,
    url: url,
    request: request,
    abortRequest: abortRequest
  };

  if (typeof window.define === 'function') {
    window.define(function() {
      return http;
    });
  } else {
    window.http = http;
  }
})();
