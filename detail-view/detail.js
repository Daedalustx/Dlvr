'use strict';

angular.module('video1.detail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:projectUrl/previews/:previewUrl', {
    templateUrl: 'detail-view/detail.html',
    controller: 'DetailViewCtrl'
  });
}])

.controller('DetailViewCtrl', ['$rootScope', '$scope', '$http', '$routeParams', function($rootScope, $scope, $http, $routeParams) {
	$rootScope.$on('$routeChangeStart', function () {
	//	console.log('routeChangeStart detail');
	});
	$scope.$on('$routeChangeSuccess', function () {
		console.log('routeChangeSuccess detail');
	});
	$scope.list = 'list-item';
	$scope.current = {};
	$scope.current.video = null;
	$scope.$watch('settings', function(newVal) {
		if (newVal) {
			$scope.source = function(fileName, ext) {
				return 'projects/' + $scope.settings.projectRootPath + '/' + $scope.path + '/' + fileName + ext;
			};
		}
	});
	$scope.$watch('data', function(newVal) {
		if (newVal) {
			var id = $routeParams.previewUrl,
				videos = $scope.videoList;
	
			// rewrite this so it breaks if video is found
	
			for (var i=0; i < videos.length; i++) {
				$scope.current.video = videos[i].previewUrl === id ? videos[i] : $scope.current.video;
			};
			
				
			
			angular.forEach($scope.videoList, function(item) {
				if (item.groupUrl == $scope.current.video.belongsTo && $scope.list != 'main') {
					$scope.listName = item.name;
				}
			});
	
			
		}
	});
}]);
