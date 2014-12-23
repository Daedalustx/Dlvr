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
		$scope.action = 'create';
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
		$scope.action = 'edit';
		$scope.projectIndex = index;
		$scope.showEditor = true;
		$scope.projectId = $scope.projects[index].projectId;
		$scope.projectName = $scope.projects[index].projectName;
		$scope.projectRootPath = $scope.projects[index].projectRootPath;
		$scope.projectLogo = $scope.projects[index].projectLogo;
		$scope.configNightTheme = $scope.projects[index].configNightTheme;
	};
	$scope.deleteProject = function(index) {
		var project = $scope.projects[index],
			confirmDelete = confirm("Are you sure you want to delete " + project.projectName + "?");
		if (confirmDelete) {
			$scope.action = 'delete';
			$scope.projects.splice(index, 1);
			$scope.updateFiles($scope.projects, $scope.action, project.projectId);
		}
	};
	$scope.writeProject = function() {
		var project = {}; 
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
		$scope.updateFiles($scope.projects, $scope.action, project.projectId);
	};
	$scope.updateFiles = function(projects, action, project) {
		
		$http({
			method: 'post',
			url: 'projects.php', 
			data : {
				"projects": projects,
				"project": project, 
				"action": action
			},
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(response) {
			$scope.showEditor = false;
			$scope.feedback = $sce.trustAsHtml(response);
			$timeout( function() {
				$scope.feedback="";
			}, 3000 );
		})
		.error(function() {
			$scope.feedback = $sce.trustAsHtml("Project " + action + " failed");
			$scope.fail = true;
			$timeout( function() {
				$scope.feedback="";
				$scope.fail = false;
			}, 3000 );
		});
		
			
	};
}]);
	