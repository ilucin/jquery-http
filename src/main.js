(function(root) {
  'use strict';

  var previousJQueryHttp = root.JQueryHttp;

  function assignDefaults(obj, data) {
    for (var key in data) {
      if (!obj[key]) {
        obj[key] = data[key];
      }
    }
    return obj;
  }

  function call(obj, method, ctx, args) {
    if (obj && typeof obj[method] === 'function') {
      obj[method].apply(ctx || window, args);
    }
  }

  var defaultConfig = {
    defaultParams: null,
    abortEquivalentRequests: true,
    isMockMode: false,
    mockRoot: '',
    serverRoot: '',
    apiRoot: ''
  };

  var createUrl = function(opts) {
    var url, route, urlParams;
    var serverRoot = this.config.serverRoot;
    var apiRoot = this.config.apiRoot;
    var mockRoot = this.config.mockRoot;

    opts = opts || {};

    if (!opts.noDefaultParams) {
      opts.params = assignDefaults(opts.params || {}, this.config.defaultParams);
    }

    if (opts.mock && this.config.isMockMode) {
      url = (mockRoot || '') + opts.mock + (opts.mock.indexOf('.json') >= 0 ? '' : '.json');
    } else {
      route = opts.route;
      urlParams = [];

      for (var key in opts.params) {
        if (opts.params.hasOwnProperty(key)) {
          if (route.indexOf(':' + key) >= 0) {
            route = route.replace(':' + key, opts.params[key]);
          } else {
            urlParams.push(key + '=' + opts.params[key]);
          }
        }
      }

      url = (serverRoot || '') + (apiRoot || '') + route + (urlParams.length > 0 ? '?' + urlParams.join('&') : '');
    }

    return url;
  };

  function createRequestKey(opts) {
    return opts.requestKey || opts.url;
  }

  var httpRequest = function(opts) {
    var self = this;

    if (typeof opts.url === 'object') {
      opts.url = this.url(opts.url);
    }

    if (!!this.config.abortEquivalentRequests && opts.requestKey) {
      this.abortRequest(opts.requestKey);
    }

    if (this.config.isMockMode) {
      opts.method = 'GET';
    }

    return new Promise(function(resolve, reject) {
      var ajaxOpts = assignDefaults({
        complete: function() {
          if (opts.requestKey && self.activeRequests[opts.requestKey]) {
            delete self.activeRequests[opts.requestKey];
          }
          call(opts, 'complete', opts.context || self, arguments);
        },
        success: function() {
          call(opts, 'success', opts.context || self, arguments);
          resolve.apply(this, arguments);
        },
        error: function() {
          call(opts, 'error', opts.context || self, arguments);
          reject.apply(this, arguments);
        }
      }, opts);

      var xhr = $.ajax(ajaxOpts);

      self.activeRequests[createRequestKey(opts)] = xhr;
    });
  };

  function JQueryHttp(opts) {
    this.config = {};
    this.activeRequests = {};
    this.setup(assignDefaults(opts || {}), defaultConfig);
  }

  JQueryHttp.prototype.setup = function(opts) {
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        this.config[key] = opts[key];
      }
    }
  };

  JQueryHttp.prototype.url = function(route, params, mock) {
    if (typeof route === 'object') {
      return createUrl.apply(this, arguments);
    } else {
      return createUrl.call(this, {
        route: route,
        params: params,
        mock: mock
      });
    }
  };

  JQueryHttp.prototype.request = function(method, route, params, data, opts) {
    if (typeof method === 'object') {
      return httpRequest.apply(this, arguments);
    } else {
      return httpRequest.call(this, assignDefaults({
        url: {
          route: route,
          params: params
        },
        method: method,
        data: data
      }, opts));
    }
  };

  JQueryHttp.prototype.abortRequest = function(requestKey) {
    if (this.activeRequests && this.activeRequests[requestKey]) {
      this.activeRequests[requestKey].abort();
      delete this.activeRequests[requestKey];
    }
  };

  JQueryHttp.noConflict = function() {
    root.JQueryHttp = previousJQueryHttp;
    return JQueryHttp;
  };

  if (typeof exports !== 'undefined') {
    exports = JQueryHttp;
  } else {
    root.JQueryHttp = JQueryHttp;
  }
})(this);
