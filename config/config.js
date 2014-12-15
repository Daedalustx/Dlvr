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
}]);
