'use strict';

angular.module('accounts', ['ngRoute'])

.run(function () {
  console.log(' - loading "accounts" module...');
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/accounts', {templateUrl: 'js/accounts/accounts.html'})
});