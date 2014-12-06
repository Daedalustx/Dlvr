'use strict';

var listModule = angular.module('video1.videoList', ['ngRoute']);

listModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/deliverables', {
    templateUrl: 'list-view/list.html',
    controller: 'VideoListCtrl'
  }).when('/deliverables/:groupName', {
    templateUrl: 'list-view/list.html',
    controller: 'NestedVideoListCtrl'
  });;
}])

.controller('VideoListCtrl', [ '$scope', '$http', function($scope, $http) {
	$scope.getHeader = function(header) {
		switch(header.index) {
			case 0:
				return "";
			case 1:
				return header.title;
			case 2:
			case 3:
			case 4:
				return header.display === true ? header.title : false;
			default:
				return;
		}
	};
				
	$scope.getIndex = function(index) {
		if ($scope.data.colHeaders[0].displayConsecutive) {
			return index + 1;
		} else {
			return $scope.data.videos[index].priority;
		}
	};
}])
.controller('NestedVideoListCtrl', [ '$scope', '$routeParams', function($scope, $routeParams) {
	$scope.getHeader = function(header) {
		switch(header.index) {
			case 0:
				return "";
			case 1:
				return $routeParams.groupName;
			case 2:
			case 3:
			case 4:
				return header.display === true ? header.title : false;
			default:
				return;
		}
	};
				
	$scope.getIndex = function(index) {
		if ($scope.data.colHeaders[0].displayConsecutive) {
			return index + 1;
		} else {
			return $scope.data.videos[index].priority;
		}
	};
}]);

listModule.directive('Headers', [ '$scope', function($scope) {
	console.log($scope);
}]);

