'use strict';

// Declare app level module which depends on views, and components
var configVideoApp = angular.module('videoConfig', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  
}])
.controller('ConfigController', ['$scope', '$http', function($scope, $http) {
	$scope.data = {};
	$http.get('delivery/project.json').success(function(list) {
		$scope.data = list;
	});
	$scope.priority = function(isSortable) {
			return isSortable ? 'priority' : 'id';
	};
	$scope.index = "index";
	$scope.testWrite = function() {
		//console.log($scope.data);
		$http({
			method: 'post',
			url: 'delivery/config.php', 
			data : $scope.data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function() {
			$scope.feedback="Delivery configured sucessfully";
		})
		.error(function() {
			$scope.feedback="Delivery configuration Failed";
		});
	};
	$scope.addRow = function() {
		var videos = $scope.data.videos,
			index = videos.length;
		videos[index] = {};
		videos[index].id = index + 1;
	};
	$scope.deleteRow = function(index) {
		var videos = $scope.data.videos;
		videos = videos.splice(index,1);
	};
	$scope.showUrl = function(path) {
		if ($scope.data.colHeaders[1].linksTo === path) return true;
	};
	$scope.showHeader = function(col, row) {
		if (col == 0 && $scope.data.colHeaders[0].sortable) {
			return true;
		} else if (col != 0 && $scope.data.colHeaders[col].display) {
			return true;
		} else {
			return false;
		}
	};
	$scope.colValue = function(col,row) {
		var item = $scope.data.videos[row];
		switch(col) {
			case 0: return 'video.priority';
			case 1: return 'video.name';
			case 2: return 'video.optional1';
			case 3: return 'video.optional2';
			case 4: return 'video.downloadFilename';
			default: return "not found";
		}
	};
	$scope.setGlobalLinkPref = function() {
		var videos = $scope.data.videos;
		angular.forEach(videos, function(video) {
			video.linksTo = $scope.data.colHeaders[1].linksTo;
		});
	};
	$scope.setUrlFromName = function(urlType) {
		var videos = $scope.data.videos;
		angular.forEach(videos, function(video) {
			var name = video.name,
				url = '';
			url = name.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase();
			if (urlType === 'preview') video.previewUrl = url;
			if (urlType === 'group') video.groupName = url;
		});
	};
	$scope.setSeqFilenames = function(fileType) {
		var videos = $scope.data.videos,
			i=0;
		angular.forEach(videos, function(video) {
			var name = ++i;
			name = name < 10 ? '0' + name.toString() : name.toString();
			//console.log(name);
			if (fileType === 'preview') video.previewFilename = name;
			if (fileType === 'download') video.downloadFilename = name + '.zip';
		});
	};
}]);
configVideoApp.directive('colInput', ['$compile', function($compile) {
	return {
		'link': function(scope, element, attrs) {
			scope.$watch(attrs.colInput, function(colInput) {
				if (attrs.ngModel == colInput || !colInput) return;
			
				element.attr('ng-model', colInput);
				if (colInput == '') {
					element.removeAttr('ng-model');
				}
			
				// Unbind all previous event handlers, this is 
				// necessary to remove previously linked models.
				element.unbind();
				$compile(element)(scope);
           }); 
		}
	};
}]);