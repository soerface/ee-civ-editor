'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('eeCivEditorApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should succeed the test', function () {
    expect(5).toBe(5);
  });
});
