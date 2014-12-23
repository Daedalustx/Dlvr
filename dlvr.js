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
	.when('/:projectUrl', {})
	.otherwise({redirectTo: '/not-found'});
  
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
			$http.get('config/' + $route.current.params.projectUrl + '.json').success( function (result) {
				console.log(result);
				$scope.settings = result;
				$scope.nightTheme = result.configNightTheme;
			
				var projectPath = '';
				projectPath = '/projects/' + $scope.settings.projectRootPath + '/project.json';
				console.log(projectPath);
				$http.get('projects/' + $scope.settings.projectRootPath + '/project.json').success(function(list) {
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



		
		
