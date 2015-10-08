'use strict';

angular.module('alarmcontrolApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
