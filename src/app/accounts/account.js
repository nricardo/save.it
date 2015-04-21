'use strict';

angular.module('accounts', ['SaveIT', 'ngRoute'])

.run(function (siResource) {
  console.log(' - loading "accounts" module...');

  siResource.register('accounts');
})

.config(function ($routeProvider) {
  $routeProvider

  .when('/accounts', {
    controller: 'accountsController',
    templateUrl: 'js/accounts/accounts.html'
  })

  .when('/accounts/:id', {
    controller: 'accountController',
    templateUrl: 'js/accounts/account.html'
  })
})

.controller('accountsController', function ($scope, siResource) {
  siResource.accounts().then(function (response) {
    $scope.accounts = response.data;
  });
})

.controller('accountController', function ($scope, $routeParams, siResource) {
  siResource.accounts($routeParams.id).then(function (response) {
    $scope.account = response.data;
  });
});