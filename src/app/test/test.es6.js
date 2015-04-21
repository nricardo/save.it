class Test
{
  constructor ($scope)
  {
    $scope.test = {
      a: 'AA',
      b: 'BBB'
    };

    this.$scope = $scope;
  }
}

angular.module('test', [])

.config(function ($routeProvider) {
  $routeProvider
  .when ('/test', {
    controller: 'testController',
    template: '<pre>{{ test | json }}</pre>'
  });
})

.controller('testController', ['$scope', Test]);