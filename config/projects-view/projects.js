'use strict';

var projects = angular.module('configuration.projects', ['ngRoute']);

projects.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/projects', {
		controller: 'projectCtrl',
		templateUrl: 'projects-view/projects.html'
	});
}])
.controller('projectCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.actionText = 'Choose a Project';
	$http.get('projects.json')
	.success(function(list) {
		if (angular.isDefined(list.projects[0])) {
			$scope.projects = list;
		} else {
			$scope.projects = '';
			$scope.actionText = 'No projects found, create one?';
		}
			
	})
	.error( function() {
		alert("Error retreiving Data");
	});
}]);
	