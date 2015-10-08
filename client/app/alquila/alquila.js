'use strict';

angular.module('alarmcontrolApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/alquila', {
        templateUrl: 'app/alquila/alquila.html',
        controller: 'AlquilaCtrl'
      });
  });
