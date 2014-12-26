'use strict';

// Declare app level module which depends on views, and components
var configVideoApp = angular.module('configuration', [
  'ngRoute',
  'configuration.projects',
  'configuration.projectSettings'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/projects'});
  $locationProvider.html5Mode(true);
}])
.controller('ConfigController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {

	$scope.title = "Dlvr";
	
	$scope.configNightTheme = true;
	$scope.$on('lightsOut', function () {
		$scope.configNightTheme = true;
	});
	$scope.$on('lightsOn', function () {
		$scope.configNightTheme = false;
	}); 
	
	$scope.actionText = 'Choose a Project';
	
	$http.get('projects.json')
	.success(function(list) {
		if (angular.isDefined(list.projects[0])) {
			$scope.projects = list.projects;
		} else {
			$scope.actionText = 'No projects found, create one?';
		}	
	})
	.error( function() {
		alert("Error retreiving Data");
	});
}])
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
