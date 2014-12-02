'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/deliverables'});
  
}])
.controller('AppController', ['$scope', '$http', function($scope, $http) {
	this.getter = $http.get('delivery/project.json').success(function(list) {
		$scope.data = list;
		$scope.videoList = list.videos;
		$scope.logo = list.clientLogo;
		$scope.path = list.previewPath;
		$scope.projectName = list.projectName;
		$scope.projectText = list.introText;
		$scope.colHeaders = list.colHeaders;
		$scope.priority = 'priority';
	});	
}]);
