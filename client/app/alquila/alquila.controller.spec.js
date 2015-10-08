'use strict';

describe('Controller: AlquilaCtrl', function () {

  // load the controller's module
  beforeEach(module('alarmcontrolApp'));

  var AlquilaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlquilaCtrl = $controller('AlquilaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
