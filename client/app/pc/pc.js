'use strict';

angular.module('alarmcontrolApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/pc', {
        templateUrl: 'app/pc/pc.html',
        controller: 'PcCtrl'
      });
  });
