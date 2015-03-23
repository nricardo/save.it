'use strict';

angular.module('dashboard', ['ngRoute'])

.run(function () {
  console.log(' - loading "dashboard" module...');
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/dashboard', {
    controller: 'dashboardController',
    templateUrl: 'js/dashboard/index.html'
  })
})

.controller('dashboardController', function ($scope) {
  $scope.test = "dashboard";
});