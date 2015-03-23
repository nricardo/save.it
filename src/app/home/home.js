'use strict';

angular.module('home', ['ngRoute'])

.run(function () {
  console.log(' - loading "home" module...');
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/', {templateUrl: 'js/home/welcome.html'})
});