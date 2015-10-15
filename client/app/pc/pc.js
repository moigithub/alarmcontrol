'use strict';

angular.module('alarmcontrolApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/pc/pc.html',
        controller: 'PcCtrl'
      });
  });
