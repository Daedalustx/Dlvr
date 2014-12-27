'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]);
		
videoApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
	.when('/:projectUrl', {})
	.otherwise({redirectTo: '/not-found'});
  $locationProvider.html5Mode(true);
}]);

videoApp.controller('AppController', ['$rootScope', '$scope', '$http', '$route', '$routeParams', '$location',  function($rootScope, $scope, $http, $route, $routeParams, $location) {
	console.log('video app controller');
	$rootScope.dataLoaded = false;
	$rootScope.$on('$routeChangeStart', function () {
		
		console.log('routeChangeStart');		
	});
	$rootScope.$on('$routeChangeSuccess', function () {
		if (!angular.isDefined($scope.data)) {
			console.log('no data yet - loading it');
			$http.get('config/projects/' + $route.current.params.projectUrl + '.json?t=' + new Date().getTime())
			.success( function (result) {
				console.log(result);
				$scope.settings = result;
				//$scope.nightTheme = result.nightTheme;
			
				var projectPath = '';
				projectPath = 'projects/' + $scope.settings.projectRootPath + '/project.json?t=' + new Date().getTime();
				console.log(projectPath);
				$http.get(projectPath)
				.success(function(list) {
					$scope.data = list;
					$scope.videoList = list.videos;
					$scope.path = list.previewPath;
					$scope.projectName = list.projectName;
					$scope.projectText = list.projectText;
					$scope.colHeaders = list.colHeaders;
					$scope.priority = list.colHeaders[0].sortable ? 'priority' : 'id';
					$scope.nightTheme = list.nightTheme;
		
					console.log('success callback');
					$rootScope.dataLoaded = true;
					console.log($route.current.params);
					
					if (!$route.current.params.groupUrl && !$route.current.params.previewUrl) {
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



		
		
