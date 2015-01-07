'use strict';

angular.module('video1.detail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/:projectUrl/:preview/:previewUrl', {
		templateUrl: 'detail-view/detail.html',
		controller: 'DetailViewCtrl',
		resolve: {
            project: function(dataService){
            	console.log('Detail resolve');
            	return dataService();
            }
        }
	});
}])

.controller('DetailViewCtrl', ['$location', '$rootScope', '$scope', '$http', '$routeParams', 'projectSharingService', 'project', function($location, $rootScope, $scope, $http, $routeParams, projectSharingService, project) {
	if (!project) return $location.path('/');
	if ( $routeParams.preview !== 'previews' ) $location.path('/' + $routeParams.projectUrl);
	var id = $routeParams.previewUrl,
		videos = [];
		
	$scope.data = $scope.data || project.data;
	
	$scope.$parent.settings = $scope.settings.projectRootPath ? $scope.settings : project.settings;
	
	videos = $scope.data.videos;
	
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
	
	console.log($scope.current.video);
	
	$scope.$parent.settings.pageTitle =  $scope.$parent.settings.projectName + ' | ' + $scope.current.video.name;
	
	if ($scope.current.video == null) return $location.path('/' + $routeParams.projectUrl);
	
	angular.forEach($scope.data.videos, function(item) {
		if (item.groupUrl == $scope.current.video.belongsTo && $scope.list != 'main') {
			$scope.listName = item.name;
		}
	});
	
}]);
