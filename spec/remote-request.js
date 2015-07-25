describe('JQueryHTTP.prototype.request() in remote mode', function() {
  'use strict';

  var JQueryHttp = window.JQueryHttp;
  var onSuccessSpy, onErrorSpy, onCompleteSpy;
  var http;

  beforeEach(function() {
    jasmine.Ajax.install();
    onSuccessSpy = jasmine.createSpy();
    onErrorSpy = jasmine.createSpy();
    onCompleteSpy = jasmine.createSpy();

    http = new JQueryHttp();
    http.setup({
      serverRoot: 'http://a.com/',
      apiRoot: 'api/'
    });

    jasmine.Ajax.stubRequest('http://a.com/api/users/5/cars').andReturn({
      'status': 200,
      'responseText': '{ "success": true }'
    });

    jasmine.Ajax.stubRequest('http://a.com/api/invalid').andReturn({
      'status': 404,
      'responseText': 'request not found'
    });

    jasmine.Ajax.stubRequest('POST', 'http://a.com/api/users/5/cars').andReturn({
      'status': 200,
      'responseText': 'POST successful'
    });
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should return a promise when making a request', function() {
    expect(http.request('GET', 'users/5/cars')).toEqual(jasmine.any(Promise));
  });

  it('should do a GET request', function(done) {
    http.request('GET', 'users/5/cars').then(onSuccessSpy, onErrorSpy).then(function() {
      expect(onSuccessSpy).toHaveBeenCalled();
      expect(onErrorSpy).not.toHaveBeenCalled();
      done();
    }).catch(done.fail);
  });

  it('should do a GET request and invoke all jquery style callbacks', function(done) {
    http.request('GET', 'users/5/cars', null, null, {
      success: onSuccessSpy,
      complete: onCompleteSpy,
      error: onErrorSpy
    }).then(function() {
      expect(onSuccessSpy).toHaveBeenCalled();
      expect(onCompleteSpy).toHaveBeenCalled();
      expect(onErrorSpy).not.toHaveBeenCalled();
      done();
    }).catch(done.fail);
  });

  it('should do a GET request and resolve promise with a response', function(done) {
    http.request('GET', 'users/5/cars').then(function(response) {
      expect(response).toEqual({
        success: true
      });
      done();
    }).catch(done.fail);
  });

  it('should do a GET request and resolve success callback with regular jquery success arguments', function(done) {
    http.request('GET', 'users/5/cars', null, null, {
      success: function(response, statusText, xhr) {
        expect(response).toEqual({
          success: true
        });
        expect(statusText).toBe('success');
        expect(xhr.responseText).toBe('{ "success": true }');
        done();
      }
    }).catch(done.fail);
  });

  it('should do a GET request and reject on error', function(done) {
    http.request('GET', 'invalid').then(onSuccessSpy, onErrorSpy).then(function() {
      expect(onSuccessSpy).not.toHaveBeenCalled();
      expect(onErrorSpy).toHaveBeenCalled();
      done();
    }).catch(done.fail);
  });

  it('should do a GET request and reject with jquery error object on error', function(done) {
    http.request('GET', 'invalid').then(done.fail, function(error) {
      expect(error.responseText).toBe('request not found');
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('error');
      done();
    });
  });

  it('should do a GET request and invoke all jquery style callbacks if error occurs', function(done) {
    http.request('GET', 'invalid', null, null, {
      success: onSuccessSpy,
      complete: onCompleteSpy,
      error: onErrorSpy
    }).then(done.fail, function() {
      expect(onSuccessSpy).not.toHaveBeenCalled();
      expect(onCompleteSpy).toHaveBeenCalled();
      expect(onErrorSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should do a GET request using options syntax', function(done) {
    http.request({
      url: {
        route: 'users/:id/cars',
        params: {
          id: '5'
        }
      },
      method: 'GET'
    }).then(onSuccessSpy, onErrorSpy).then(function() {
      expect(onSuccessSpy).toHaveBeenCalled();
      expect(onErrorSpy).not.toHaveBeenCalled();
      done();
    }).catch(done.fail);
  });

  it('should do a POST request', function(done) {
    http.request('POST', 'users/5/cars').then(onSuccessSpy, onErrorSpy).then(function() {
      expect(onSuccessSpy).toHaveBeenCalled();
      expect(onErrorSpy).not.toHaveBeenCalled();
      done();
    }).catch(done.fail);
  });
});
