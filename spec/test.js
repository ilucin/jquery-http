describe('jQuery HTTP', function() {
  'use strict';

  var onSuccessSpy, onErrorSpy, onCompleteSpy;
  var http;

  beforeEach(function() {
    jasmine.Ajax.install();
    onSuccessSpy = jasmine.createSpy();
    onErrorSpy = jasmine.createSpy();
    onCompleteSpy = jasmine.createSpy();

    http = window.http;

    jasmine.Ajax.stubRequest('http://something.com/api/v1/users/5/cars').andReturn({
      'status': 200,
      'responseText': 'GET successful'
    });

    jasmine.Ajax.stubRequest('http://something.com/api/v1/users/5/invalid').andReturn({
      'status': 404,
      'responseText': 'request not found'
    });

    jasmine.Ajax.stubRequest('POST', 'http://something.com/api/v1/users/5/cars').andReturn({
      'status': 200,
      'responseText': 'POST successful'
    });
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should exist in global scope', function() {
    expect(window.http).not.toBe(undefined);
  });

  it('should have a proper API exposed', function() {
    expect(http.setup).toEqual(jasmine.any(Function));
    expect(http.request).toEqual(jasmine.any(Function));
    expect(http.url).toEqual(jasmine.any(Function));
    expect(http.abortRequest).toEqual(jasmine.any(Function));
  });

  describe('in remote mode', function() {
    beforeEach(function() {
      http.setup({
        serverRoot: 'http://something.com',
        apiRoot: '/api/v1',
      });
    });

    afterEach(function() {
      http.reset();
    });

    it('should create a valid URL with params', function() {
      expect(http.url({
        route: 'user/:id/profile',
        params: {
          id: 5,
          name: 'Pero',
          surname: 'Peric'
        }
      })).toBe('http://something.com/api/v1/user/5/profile?name=Pero&surname=Peric');
    });

    it('should create a valid URL with params', function() {
      expect(http.url({
        route: 'user/:id/profile',
        params: {
          id: 5,
          name: 'Pero',
          surname: 'Peric'
        }
      })).toBe('http://something.com/api/v1/user/5/profile?name=Pero&surname=Peric');
    });

    it('should create a valid URL with params and default params', function() {
      http.setup({
        defaultParams: {
          'car': 'honda'
        }
      });

      expect(http.url({
        route: 'user/:id/profile',
        params: {
          id: 5,
          name: 'Pero'
        }
      })).toBe('http://something.com/api/v1/user/5/profile?name=Pero&car=honda');
    });

    it('should do a GET request', function(done) {
      http.request('GET', 'users/5/cars').then(function(resp) {
        expect(resp).toBe('pero');
        done();
      }, function() {
        done.fail();
      });
    });
  });

  describe('in local mode', function() {
    beforeEach(function() {
      http.setup({
        isMockMode: true,
        mockRoot: '/mock'
      });
    });

    it('should create a valid URL with params', function() {
      expect(http.url({
        mock: 'user-profile',
        route: 'user/:id/profile',
      })).toBe('/mock/user-profile.json');
    });

    it('should create a valid URL with shorter syntax', function() {
      expect(http.url('user/5/profile', null, 'user-profile')).toBe('/mock/user-profile.json');
    });
  });

  // it('should call a custom function on success', function() {
  //
  //   ajaxReq('/beauties-only/safo', {
  //     success: this.onSuccessSpy,
  //     failure: this.onFailureSpy
  //   });
  //
  //   expect(this.onSuccessSpy).toHaveBeenCalled();
  //   expect(this.onFailureSpy).not.toHaveBeenCalled();
  // });
});
