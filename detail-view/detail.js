'use strict';

angular.module('video1.detail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/:projectUrl/previews/:previewUrl', {
		templateUrl: 'detail-view/detail.html',
		controller: 'DetailViewCtrl',
		resolve: {
            project: function(dataService){
            	console.log('resolve');
            	return dataService();
            }
        }
	});
}])

.controller('DetailViewCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'projectSharingService', 'project', function($rootScope, $scope, $http, $routeParams, projectSharingService, project) {
	var id = $routeParams.previewUrl,
		videos = [];
		
	$scope.data = $scope.data || project.data;
	$scope.$parent.settings = $scope.settings.projectRootPath ? $scope.settings : project.settings;
	
	videos = $scope.data.videos;
	
	/*
	$rootScope.$on('$routeChangeStart', function () {
	//	console.log('routeChangeStart detail');
	});
	$scope.$on('$routeChangeSuccess', function () {
		console.log('routeChangeSuccess detail');
	});
	*/
	$scope.list = 'list-item';
	$scope.current = {};
	$scope.current.video = null;

	$scope.source = function(fileName, ext) {
		return 'projects/' + $scope.settings.projectRootPath + '/' + $scope.data.previewPath + '/' + fileName + ext;
	};

			
	
	// rewrite this so it breaks if video is found

	for (var i=0; i < videos.length; i++) {
		$scope.current.video = videos[i].previewUrl === id ? videos[i] : $scope.current.video;
	};
	
	
	
	angular.forEach($scope.data.videos, function(item) {
		if (item.groupUrl == $scope.current.video.belongsTo && $scope.list != 'main') {
			$scope.listName = item.name;
		}
	});
	
}]);
