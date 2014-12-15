'use strict';

var projects = angular.module('configuration.projects', ['ngRoute']);

projects.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/projects', {
		controller: 'projectCtrl',
		templateUrl: 'projects-view/projects.html'
	});
}])
.controller('projectCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
	
	$scope.createProject = function() {
		$scope.projects = $scope.projects || [];
		$scope.projectIndex = $scope.projects.length;
		$scope.create = true;
		$scope.projectId = "";
		$scope.projectName = "";
		$scope.projectRootPath = "";
		$scope.configNightTheme = true;
	};
	$scope.editProject = function(index) {
		$scope.projectIndex = index;
		$scope.create = true;
		$scope.projectId = $scope.projects[index].projectId;
		$scope.projectName = $scope.projects[index].projectName;
		$scope.projectRootPath = $scope.projects[index].projectRootPath;
		$scope.configNightTheme = $scope.projects[index].configNightTheme;
	};
	$scope.deleteProject = function(index) {
		var confirmDelete = confirm("Are you sure you want to delete " + $scope.projects[index].projectName + "?");
		if (confirmDelete) {
			$scope.projects.splice(index, 1);
			$http({
				method: 'post',
				url: 'projects.php', 
				data : {"projects": $scope.projects},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function() {
				$scope.feedback="Project Deleted sucessfully";
				$timeout( function() {
					$scope.feedback="";
				}, 2000 );
			})
			.error(function() {
				$scope.feedback="Project Delete Failed";
				$timeout( function() {
					$scope.feedback="";
				}, 3000 );
			});
		}
	};
	$scope.writeProject = function() {
		var project = {}; 
		$scope.create = false;
		project.projectId = $scope.projectId;
		project.projectName = $scope.projectName;
		project.projectRootPath = $scope.projectRootPath;
		project.configNightTheme = $scope.configNightTheme;
		if ($scope.projects[$scope.projectIndex]) {
			$scope.projects[$scope.projectIndex] = project;
		} else {
			$scope.projects.push(project);
		}
		$http({
			method: 'post',
			url: 'projects.php', 
			data : {"projects": $scope.projects},
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function() {
			$scope.feedback="Project Saved sucessfully";
			$timeout( function() {
				$scope.feedback="";
			}, 2000 );
		})
		.error(function() {
			$scope.feedback="Project Save Failed";
			$timeout( function() {
				$scope.feedback="";
			}, 3000 );
		});
	};
}]);
	