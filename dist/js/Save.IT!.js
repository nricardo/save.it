/**
 * Save.IT! - v0.0.1
 * https://github.com/nricardo/save.it
 *
 * Copyright (c) 2015 Nelson Ricardo
 * License: MIT (https://raw.github.com/nricardo/save.it/master/LICENSE)
 */'use strict';

angular.module('accounts', ['ngRoute'])

.run(function () {
  console.log(' - loading "accounts" module...');
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/accounts', {templateUrl: 'js/accounts/accounts.html'})
});;

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
});;

'use strict';

angular.module('home', ['ngRoute'])

.run(function () {
  console.log(' - loading "home" module...');
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/', {templateUrl: 'js/home/welcome.html'})
});;

'use strict';

angular.module('SaveIT', ['home', 'dashboard', 'accounts', 'ui.bootstrap'])

.run(function () {
  console.info(' # Sav€.IT! application up and running!');
});
//# sourceMappingURL=Save.IT!.js.map