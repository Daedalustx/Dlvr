'use strict';

// Declare app level module which depends on views, and components
var configVideoApp = angular.module('configuration', [
  'ngRoute',
  'configuration.projects',
  'configuration.projectSettings'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/projects'});
}])
.controller('ConfigController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	
}]);
