'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]);
		
videoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
	.when('/:projectUrl', {
	
		
	})
	.otherwise({redirectTo: '/not-found'});
  
}]);

videoApp.controller('AppController', ['$rootScope', '$scope', '$http', '$route', '$routeParams', '$location',  function($rootScope, $scope, $http, $route, $routeParams, $location) {
	console.log('video app controller');
	$rootScope.$on('$routeChangeSuccess', function () {
		if (!angular.isDefined($route.current.params.groupUrl)) {
			$http.get('config/' + $route.current.params.projectUrl + '.json').success( function (result) {
				console.log(result);
				//test.writeSettings(result);
				$scope.settings = result;
				$scope.nightTheme = result.configNightTheme;
			
				var projectPath = '';
				projectPath = '/' + $scope.settings.projectRootPath + '/project.json';
				console.log(projectPath);
				$http.get($scope.settings.projectRootPath + '/project.json').success(function(list) {
					$scope.data = list;
					$scope.videoList = list.videos;
					$scope.logo = list.clientLogo;
					$scope.path = list.previewPath;
					$scope.projectName = list.projectName;
					$scope.projectText = list.projectText;
					$scope.colHeaders = list.colHeaders;
					$scope.priority = list.colHeaders[0].sortable ? 'priority' : 'id';
					$scope.nightTheme = list.nightTheme;
		
					console.log('success callback');
					console.log($scope.data);
					if (!$route.current.params.groupUrl) {
						$location.path('/' + $scope.settings.projectId + '/main');
					}
				})
				.error( function() {
					alert("Could not find project.json");
				});
			
			
			})
			.error( function (errordata) {
				console.log(errordata);
			});
		}
	});
}]);



		
		
