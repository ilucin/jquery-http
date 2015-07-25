describe('jQuery HTTP', function() {
  'use strict';

  var JQueryHttp = window.JQueryHttp;
  var http;

  beforeEach(function() {
    http = new JQueryHttp();
  });

  it('should exist in global scope', function() {
    expect(window.JQueryHttp).not.toBe(undefined);
  });

  it('should have a proper API exposed', function() {
    expect(JQueryHttp.prototype.setup).toEqual(jasmine.any(Function));
    expect(JQueryHttp.prototype.request).toEqual(jasmine.any(Function));
    expect(JQueryHttp.prototype.url).toEqual(jasmine.any(Function));
    expect(JQueryHttp.prototype.abortRequest).toEqual(jasmine.any(Function));
  });
});
