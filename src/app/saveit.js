'use strict';

angular.module('SaveIT', ['home', 'dashboard', 'accounts', 'test', 'ui.bootstrap', 'angulartics', 'angulartics.google.analytics'])

.run(function () {
  console.info(' # Sav€.IT! application up and running!');
})

.service('siResource', function ($http) {
  var service = {
    register: function (resource) {
      this[resource] = function (id) {
        var path = '/data/' + (id===undefined ? resource : id) + '.json';
        return $http.get(path);
      }

      return this;
    }
  }

  return service;
})

.controller('FooterController', function ($scope) {
  $scope.year = new Date().getFullYear();
});