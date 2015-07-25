describe('JQueryHTTP.prototype.url()', function() {
  'use strict';

  var JQueryHttp = window.JQueryHttp;
  var http;

  beforeEach(function() {
    http = new JQueryHttp();
  });

  it('should create remote URL with params', function() {
    http.setup({
      serverRoot: 'http://a.com',
      apiRoot: '/api/'
    });

    expect(http.url({
      route: 'user/:id/profile',
      params: {
        id: 5,
        name: 'Pero',
        surname: 'Peric'
      }
    })).toBe('http://a.com/api/user/5/profile?name=Pero&surname=Peric');
  });


  it('should create remote URL with params using shorter syntax', function() {
    http.setup({
      serverRoot: 'http://a.com',
      apiRoot: '/api/'
    });

    expect(http.url('user/:id/profile', {
      id: 5,
      name: 'Pero',
      surname: 'Peric'
    })).toBe('http://a.com/api/user/5/profile?name=Pero&surname=Peric');
  });

  it('should create remote URL with params and default params', function() {
    http.setup({
      defaultParams: {
        'car': 'honda'
      },
      serverRoot: 'http://something.com',
      apiRoot: '/api/v1/'
    });

    expect(http.url({
      route: 'user/:id/profile',
      params: {
        id: 5,
        name: 'Pero'
      }
    })).toBe('http://something.com/api/v1/user/5/profile?name=Pero&car=honda');
  });

  it('should create remote URL if server root has not been defined', function() {
    http.setup({
      apiRoot: 'api/'
    });
    expect(http.url('users/5')).toBe('api/users/5');
  });

  it('should create remote URL if api root has not been defined', function() {
    http.setup({
      serverRoot: 'http://a.com/'
    });
    expect(http.url('users/5')).toBe('http://a.com/users/5');
  });

  it('should create mock URL with params', function() {
    http.setup({
      isMockMode: true,
      mockRoot: '/mock/'
    });
    expect(http.url({
      mock: 'user-profile',
      route: 'user/:id/profile',
    })).toBe('/mock/user-profile.json');
  });

  it('should create mock URL with shorter syntax', function() {
    http.setup({
      isMockMode: true,
      mockRoot: '/mock/'
    });
    expect(http.url('user/5/profile', null, 'user-profile')).toBe('/mock/user-profile.json');
  });
});
