'use strict';

angular.module('video1.detail', ['ngRoute', 'video1'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/previews/:previewUrl', {
    templateUrl: 'detail-view/detail.html',
    controller: 'DetailViewCtrl'
  });
}])

.controller('DetailViewCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	$scope.list = 'list-item';
	
	var id = $routeParams.previewUrl,
		videos = $scope.videoList;
	
	$scope.video = null;
	
	for (var i=0; i < videos.length; i++) {
		$scope.video = videos[i].previewUrl === id ? videos[i] : $scope.video;
	};
	
	angular.forEach($scope.videoList, function(item) {
		if (item.groupUrl == $scope.video.belongsTo && $scope.list != 'main') {
			$scope.listName = item.name;
		}
	});
	
	$scope.source = function(path, fileName, ext) {
	//console.log(path + id);
		return path + fileName + ext;
		
	}
}]);
