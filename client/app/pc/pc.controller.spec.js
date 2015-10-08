'use strict';

describe('Controller: PcCtrl', function () {

  // load the controller's module
  beforeEach(module('alarmcontrolApp'));

  var PcCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PcCtrl = $controller('PcCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
