'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider

  .otherwise({redirectTo: '/not-found'});
  
}])
.controller('AppController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	
	$http.get('delivery/project.json').success(function(list) {
		$scope.data = list;
		$scope.videoList = list.videos;
		$scope.logo = list.clientLogo;
		$scope.path = list.previewPath;
		$scope.projectName = list.projectName;
		$scope.projectText = list.projectText;
		$scope.colHeaders = list.colHeaders;
		$scope.priority = list.colHeaders[0].sortable ? 'priority' : 'id';
		$scope.nightTheme = list.nightTheme;
	})
	.error( function() {
		alert("Could not find project.json");
	});
	
}]);


$http.get('/config/' + $routeParams.projectUrl + '.json').success( function (settings) {
		$scope.rootPath = settings.projectRootPath;
	})
	.error( function () {
		alert("Could not find settings file");
	});