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
	
	$scope.$parent.pageTitle = "Dlvr | Projects";
	
	$scope.createProject = function() {
		$scope.project = {
							projectId: "",
							projectName: "",
							projectRootPath: "",
							projectLogo: "",
							linked: false,
							configNightTheme: true
						 };
		$scope.action = 'create';
		$scope.projects = $scope.projects || [];
		$scope.currentProjectIndex = $scope.projects.length;
		$scope.showEditor = 'create';
		//$scope.projects[$scope.currentProjectIndex] = $scope.project;
		
	};
	$scope.editProject = function(index) {
		//console.log(index);
		$scope.action = 'edit';
		$scope.currentProjectIndex = index;
		$scope.showEditor = index;
		$scope.uneditedCopy = angular.copy($scope.projects[index]);
	};
	$scope.hideEditor = function (event) {
		event.preventDefault();
		//console.log($scope.currentProjectIndex);
		if ($scope.action == 'edit') {
			$scope.projects[$scope.currentProjectIndex] = $scope.uneditedCopy;
		};
		delete $scope.uneditedCopy;
		$scope.action = false;
		$scope.showEditor = false;
	};
	$scope.deleteProject = function(index) {
		var projectId = $scope.projects[index].projectId,
			confirmDelete = confirm("Are you sure you want to delete " + $scope.projects[index].projectName + "?");
		if (confirmDelete) {
			$scope.action = 'delete';
			//$scope.projects.splice(index, 1);
			//console.log($scope.projects);
			
			$scope.updateFiles($scope.projects, $scope.action, projectId);
		}
	};
	$scope.writeProject = function(project) {
		
		var stripSlashes = function (str) {
			str = str.replace(/[\/]+/g, '/');
			if (str.indexOf('/') == 0) {
				str = str.slice(1);
			}
			if (str.slice(-1) == '/') {
				str = str.slice(0, -1);
			} 
			return str;
		};
		
		if ($scope.action == 'create') {
			$scope.projects[$scope.currentProjectIndex] = $scope.project;
		};
		
		project.projectRootPath = stripSlashes(project.projectRootPath);
		project.projectLogo = stripSlashes(project.projectLogo);
		project.revisionStamp = new Date();
		
		if ($scope.projects[$scope.currentProjectIndex]) { 
			$scope.projects[$scope.currentProjectIndex] = project; // edit a project
		} else { 
			$scope.projects.push(project); //create a project
		}
		//console.log($scope.projects);
		
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
			$scope.action = false;
			$scope.feedback = $sce.trustAsHtml(response.responseText);
			//console.log($scope.projects);
			//$scope.getData();
			$scope.projects = response.projects;
			$timeout( function() {
				if ( ! angular.isDefined($scope.projects[0]) ) $scope.actionText = 'No projects found, create one?';
				$scope.feedback="";
				//$route.reload();
			}, 3000 );
		})
		.error(function(data, status) {
			$scope.feedback = $sce.trustAsHtml("Project " + action + " failed<br>" + status + ' ' + data );
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
				$scope.writeProject($scope.projects[index]);
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

projects.directive('editor', function() {
	return {
		templateUrl: 'projects-view/project-editor.html'
	};
});

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
	var IMG_PATH_REGEXP_CHARS = /^[0-9A-Za-z_\/\.-]*$/;
	//var IMG_PATH_REGEXP = /[0-9A-Za-z-]+\.(jpg|png|gif|jpeg)/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.logoFilename = function(modelValue, viewValue) {
				if (!viewValue || IMG_PATH_REGEXP_CHARS.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});

projects.directive('logoExt', function() {
	var IMG_PATH_REGEXP = /[0-9A-Za-z-]+\.(jpg|png|gif|jpeg)/;
  	return {
    	require: 'ngModel',
    	link: function(scope, elm, attrs, ctrl) {
      		ctrl.$validators.logoExt = function(modelValue, viewValue) {
				if (!viewValue || IMG_PATH_REGEXP.test(viewValue)) {
					 // it is valid
					return true;
				}

				// it is invalid
				return false;
			};
		}
	};
});