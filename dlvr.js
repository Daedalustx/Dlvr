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
  	.when('/', {
  		templateUrl: 'dlvr.html'
  	})
	.when('/:projectUrl', {})
	.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);

videoApp.controller('AppController', ['$rootScope', '$scope', '$http', '$route', '$routeParams', '$location', '$window',  function($rootScope, $scope, $http, $route, $routeParams, $location, $window) {
	console.log('video app controller');
	if ($location.path() == '/') {
		$scope.settings = {};
		$scope.settings.projectName = 'Dlvr';
		$scope.nightTheme = true;
		return;
	};
	$rootScope.dataLoaded = false;
	$rootScope.$on('$routeChangeStart', function () {
		
		//console.log('routeChangeStart');		
	});
	$rootScope.$on('$routeChangeSuccess', function () {
		if (!angular.isDefined($scope.data)) {
			//console.log('no data yet - loading it');
			$http.get('projects/' + $route.current.params.projectUrl + '.json?t=' + new Date().getTime())
			.success( function (result) {
				$scope.settings = result;
			
				var projectPath = 'projects/' + $scope.settings.projectRootPath + '/project.json?t=' + new Date().getTime();
				//console.log(projectPath);
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
		
					//console.log('success callback');
					$rootScope.dataLoaded = true;
					//console.log($route.current.params);
					
				//	console.log($scope.videoList);
					
					if (!$route.current.params.groupUrl && !$route.current.params.previewUrl) {
						$location.path('/' + $scope.settings.projectId + '/main').replace();
					}
				})
				.error( function() {
					alert("Could not find project.json");
				});
			
			
			})
			.error( function (errordata) {
				$location.path('/');
				$window.location.reload();
			});
		}
	});
}]);



		
		
