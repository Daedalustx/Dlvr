'use strict';

var projects = angular.module('configuration.projects', ['ngRoute']);

projects.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/projects', {
		controller: 'projectCtrl',
		templateUrl: 'projects-view/projects.html'
	});
}])
.controller('projectCtrl', ['$scope', '$http', '$timeout', '$sce', function ($scope, $http, $timeout, $sce) {
	
	$scope.createProject = function() {
		$scope.projects = $scope.projects || [];
		$scope.projectIndex = $scope.projects.length;
		$scope.showEditor = true;
		$scope.projectId = "";
		$scope.projectName = "";
		$scope.projectRootPath = "";
		$scope.projectLogo = "";
		$scope.configNightTheme = true;
	};
	$scope.editProject = function(index) {
		$scope.projectIndex = index;
		$scope.showEditor = true;
		$scope.projectId = $scope.projects[index].projectId;
		$scope.projectName = $scope.projects[index].projectName;
		$scope.projectRootPath = $scope.projects[index].projectRootPath;
		$scope.projectLogo = $scope.projects[index].projectLogo;
		$scope.configNightTheme = $scope.projects[index].configNightTheme;
	};
	$scope.deleteProject = function(index) {
		var projectName = $scope.projects[index].projectName,
			confirmDelete = confirm("Are you sure you want to delete " + projectName + "?");
		if (confirmDelete) {
			$scope.projects.splice(index, 1);
			$http({
				method: 'post',
				url: 'projects.php', 
				data : {"projects": $scope.projects},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function() {
				$scope.feedback = projectName + " Deleted sucessfully";
				$timeout( function() {
					$scope.feedback="";
				}, 2000 );
			})
			.error(function() {
				$scope.feedback="Project Delete Failed";
				$scope.fail = true;
				$timeout( function() {
					$scope.feedback="";
					$scope.fail = false;
				}, 3000 );
			});
		}
	};
	$scope.writeProject = function() {
		var project = {}; 
		$scope.showEditor = false;
		project.projectId = $scope.projectId;
		project.projectName = $scope.projectName;
		project.projectRootPath = $scope.projectRootPath;
		project.projectLogo = $scope.projectLogo;
		project.configNightTheme = $scope.configNightTheme;
		project.revisionStamp = new Date();
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
		.success(function(response) {
			$scope.feedback = $sce.trustAsHtml(response);
			$timeout( function() {
				$scope.feedback="";
			}, 2000 );
		})
		.error(function() {
			$scope.feedback="Project Save Failed";
			$scope.fail = true;
			$timeout( function() {
				$scope.feedback="";
				$scope.fail = false;
			}, 3000 );
		});
	};
}]);
	