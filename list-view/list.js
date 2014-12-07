'use strict';

var listModule = angular.module('video1.videoList', ['ngRoute']);

listModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/deliverables', {
    templateUrl: 'list-view/list.html',
    controller: 'VideoListCtrl'
  }).when('/deliverables/:groupName', {
    templateUrl: 'list-view/list.html',
    controller: 'VideoListCtrl'
  });;
}])

.controller('VideoListCtrl', [ '$scope', '$http', function($scope, $http) {				
	
}]);

listModule.directive('dlvrHeaders', function() {
	return {
		restrict: 'E',
		scope: {
			headers: '='
		},
		controller: function($scope, $routeParams) {
			$scope.getHeader = function(header) {
				var group = angular.isDefined($routeParams.groupName) ? $routeParams.groupName : null;
				switch(header.index) {
					case 0:
						return header.display === true ? header.title : "";
					case 1:
						return header.title;
					case 2:
					case 3:
					case 4:
						return header.display === true ? header.title : false;
					default:
						return;
				};
			};
		},
		templateUrl: 'list-view/dlvr-headers.html'
	};
});

listModule.directive('videoList', function() {
	return {
		restrict: 'E',
		transclude: true,
		controller: function($scope, $routeParams) {
			$scope.getIndex = function(index, priority) {
				if ($scope.data.colHeaders[0].displayConsecutive) {
					return index + 1;
				} else {
					return priority;
				}
			};
		},
		templateUrl: 'list-view/video-list.html'
	};
});


