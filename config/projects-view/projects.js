'use strict';

var projects = angular.module('configuration.projects', ['ngRoute']);

projects.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/projects', {
		controller: 'projectCtrl',
		templateUrl: 'projects-view/projects.html'
	});
}])
.controller('projectCtrl', ['$route', '$location', '$scope', '$http', '$timeout', '$sce', function ($route, $location, $scope, $http, $timeout, $sce) {
	
	$scope.createProject = function() {
		$scope.action = 'create';
		$scope.projects = $scope.projects || [];
		$scope.projectIndex = $scope.projects.length;
		$scope.showEditor = true;
		$scope.projectId = "";
		$scope.projectName = "";
		$scope.projectRootPath = "";
		$scope.projectLogo = "";
		$scope.linked = false;
		$scope.configNightTheme = true;
		//console.log($scope.projects);
	};
	$scope.editProject = function(index) {
	//	console.log(index);
		$scope.action = 'edit';
		$scope.projectIndex = index;
		$scope.showEditor = true;
		$scope.projectId = $scope.projects[index].projectId;
		$scope.projectName = $scope.projects[index].projectName;
		$scope.projectRootPath = $scope.projects[index].projectRootPath;
		$scope.projectLogo = $scope.projects[index].projectLogo;
		$scope.linked = $scope.projects[index].linked;
		$scope.configNightTheme = $scope.projects[index].configNightTheme;
	};
	$scope.hideEditor = function (event) {
		event.preventDefault();
		$scope.showEditor = false;	
	};
	$scope.deleteProject = function(index) {
		var project = $scope.projects[index],
			confirmDelete = confirm("Are you sure you want to delete " + project.projectName + "?");
		if (confirmDelete) {
			$scope.action = 'delete';
			$scope.projects.splice(index, 1);
			//console.log($scope.projects);
			if ( ! angular.isDefined($scope.projects[0]) ) $scope.actionText = 'No projects found, create one?';
			$scope.updateFiles($scope.projects, $scope.action, project.projectId);
		}
	};
	$scope.writeProject = function() {
		var project = {},
			stripSlashes;
		stripSlashes = function (str) {
			str = str.replace(/[\/]+/g, '/');
			if (str.indexOf('/') == 0) {
				str = str.slice(1);
			}
			if (str.slice(-1) == '/') {
				str = str.slice(0, -1);
			} 
			return str;
		};
		
		project.projectId = $scope.projectId;
		project.projectName = $scope.projectName;
		project.projectRootPath = stripSlashes($scope.projectRootPath);
		project.projectLogo = stripSlashes($scope.projectLogo);
		project.linked = $scope.linked;
		project.configNightTheme = $scope.configNightTheme;

		if (project.projectId && project.projectName && project.projectRootPath ) {
			project.revisionStamp = new Date();
			if ($scope.projects[$scope.projectIndex]) {
				$scope.projects[$scope.projectIndex] = project;
			} else {
				$scope.projects.push(project);
			}
			//console.log($scope.projects);
			$scope.updateFiles($scope.projects, $scope.action, project.projectId);
		} else {
			console.log(project.projectId);
			console.log(project.projectName);
			console.log(project.projectRootPath);
			console.log(project.projectLogo);
		}
	
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
			//console.log($scope.projects);
			$scope.getData();
			$timeout( function() {
				$scope.feedback="";
				$route.reload();
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
	$scope.editSettings = function (event, id) {
		event.preventDefault();
		//console.log($scope.projects);
	//	console.log(id);
		$location.path('projects/' + id);
	};
	$scope.createFolder = function(folderName, index) {
		$http({
			method: 'post',
			url: 'mkdir.php', 
			data : {"folder":folderName},
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(response) {
			$scope.feedback = $sce.trustAsHtml(response);
			$scope.editProject(index);
			$timeout( function() {
				
				$scope.writeProject();
			}, 2000 );
		})
		.error(function() {
			$scope.feedback = $sce.trustAsHtml("An unknown error occurred.<br>Could not create folder.");
			$scope.fail = true;
			$timeout( function() {
				$scope.feedback="";
				$scope.fail = false;
			}, 3000 );
		});	
	};
}]);

projects.directive('projectId', function() {
	var ID_REGEXP = /^[0-9A-Za-z_-]*$/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.projectId = function(modelValue, viewValue) {
				if (ID_REGEXP.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});

projects.directive('projectName', function() {
	var PNAME_REGEXP = /^[\s0-9A-Za-z-]*$/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.projectName = function(modelValue, viewValue) {
				if (PNAME_REGEXP.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});

projects.directive('folderName', function() {
	var FNAME_REGEXP = /^[0-9A-Za-z\/-]*$/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.folderName = function(modelValue, viewValue) {
				if (FNAME_REGEXP.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});

projects.directive('logoFilename', function() {
	var IMG_PATH_REGEXP = /[0-9A-Za-z-]+\.(jpg|png|gif|jpeg)/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.logoFilename = function(modelValue, viewValue) {
				if (IMG_PATH_REGEXP.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});