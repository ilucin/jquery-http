describe('JQueryHTTP.prototype.request() in mock mode', function() {
  'use strict';

  var JQueryHttp = window.JQueryHttp;
  var onSuccessSpy, onErrorSpy;
  var http;

  beforeEach(function() {
    jasmine.Ajax.install();
    onSuccessSpy = jasmine.createSpy();
    onErrorSpy = jasmine.createSpy();

    jasmine.Ajax.stubRequest('mock/test.json').andReturn({
      'status': 200,
      'responseText': '{ "success": true }'
    });

    http = new JQueryHttp();
    http.setup({
      isMockMode: true,
      mockRoot: 'mock/'
    });
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should do a mock request', function(done) {
    http.request({
      method: 'GET',
      url: {
        route: 'users/5',
        mock: 'test'
      }
    }).then(onSuccessSpy, onErrorSpy).then(function() {
      expect(onSuccessSpy).toHaveBeenCalled();
      expect(onErrorSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it('should do a mock request and resolve with json', function(done) {
    http.request({
      method: 'GET',
      url: {
        mock: 'test'
      }
    }).then(function(response) {
      expect(response).toEqual({
        success: true
      });
      done();
    });
  });

  it('should do a mock GET request even if remote request is POST', function(done) {
    http.request({
      method: 'POST',
      url: {
        route: 'users/5',
        mock: 'test'
      }
    }).then(function(response) {
      expect(response).toEqual({
        success: true
      });
      done();
    });
  });
});
