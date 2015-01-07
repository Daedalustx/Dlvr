'use strict';

var projectSettings = angular.module('configuration.projectSettings', ['ngRoute']);

projectSettings.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/projects/:projectId', {
		controller: 'projectSettingsCtrl',
		templateUrl: 'settings-view/settings.html'
	});
}])
.controller('projectSettingsCtrl', ['$sce', '$scope', '$http', '$timeout', '$routeParams', '$location', function ($sce, $scope, $http, $timeout, $routeParams, $location) {
	for (var i=0, length=$scope.projects.length; i < length; i++) {
		if ($scope.projects[i].projectId === $routeParams.projectId) {
			$scope.settings = $scope.projects[i];
			$scope.$parent.pageTitle = "Configure " + $scope.settings.projectName;
			break;
		}
	};
	if ( $scope.settings.configNightTheme ) {
		$scope.$emit('lightsOut');
	} else {
		$scope.$emit('lightsOn');
	};
	$scope.data = {};
	$scope.data.projectName = $scope.settings.projectName;
	$scope.$parent.title = $scope.data.projectName;
	$scope.data.rootPath = $scope.settings.projectRootPath;
	$http.get('../projects/' + $scope.settings.projectRootPath + '/project.json?t=' + new Date().getTime())
		.success(function(list) {
			$scope.data = list;
			
		})
		.error( function() {
			var feedback = "Project Settings File Not Found. <br>";
			if ($scope.settings.linked) {
				feedback+=$sce.trustAsHtml(" Creating Defaults...");
				$scope.data.colHeaders = [
					{"index":0,"id":"priority","title":"Priority","visible":true,"display":true,"sortable":false,"displayConsecutive":true},
					{"index":1,"id":"title","title":"Title","visible":true,"display":true,"linksTo":"previewUrl"},
				
					{"index":2,"id":"optional-1","optional":true,"title":"Interview Subject","visible":true,"display":false,"linksTo":false},
					{"index":3,"id":"optional-2","optional":true,"title":"Notes","visible":false,"display":false,"linksTo":false},
					{"index":4,"id":"download","optional":true,"title":"Download","visible":true,"display":true,"displayDownloadAsIcon":false,"iconFilename":"download.png"}
				];
				$scope.data.previewPath = 'videos';
				$scope.data.downloadPath = 'downloads';
			};
			$scope.feedback=$sce.trustAsHtml(feedback);
			$timeout( function() {
				$scope.feedback="";
			}, 3000 );
		});
	$scope.priority = function(isSortable) {
			return isSortable ? 'priority' : 'id';
	};
	$scope.index = "index";
	$scope.anyGroups = function() {
		var anyItemIsGroup = false,
			groupUrls = ['main'];
		angular.forEach($scope.data.videos, function(video) {
			if (video.isGroup) {
				anyItemIsGroup = true;
				if (groupUrls.indexOf(video.groupUrl) == -1) {
					groupUrls.push(video.groupUrl);
				}
			}
		});
		$scope.groupUrls = groupUrls;
		return anyItemIsGroup;
	};
	$scope.watchIsGroup = function(item) {
		item.isGroup = item.linksTo == 'groupUrl' ? true : false;
	};
	$scope.writeData = function() {
		var path = 'settings-view/settings.php';
		angular.forEach($scope.data.videos, function (video) {
			if (!video.poster) {
				video.poster = 'default';
			};
			if (video.poster == 'frame' && !angular.isDefined(video.posterFrame) ) {
				video.posterFrame = 0;
			}
		});
		$scope.data.revisionStamp = new Date();
		$http({
			method: 'post',
			url: path, 
			data : $scope.data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function() {
			$scope.feedback=$sce.trustAsHtml("Delivery configured sucessfully");
			$timeout( function() {
				$scope.feedback="";
			}, 2000 );
		})
		.error(function() {
			$scope.feedback=$sce.trustAsHtml("Delivery configuration Failed");
			$timeout( function() {
				$scope.feedback="";
			}, 3000 );
		});
	};
	$scope.addRow = function() {
		var videos = $scope.data.videos || [],
			index = angular.isDefined(videos) ? videos.length : 0;
		videos[index] = {};
		videos[index].id = index + 1;
		videos[index].belongsTo = 'main';
		videos[index].linksTo = 'false';
		if (index === 0) {
			$scope.data.videos = videos;
		}
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
			if (urlType === 'group' && video.isGroup) video.groupUrl = url;
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
projectSettings.directive('colInput', ['$compile', function($compile) {
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

projectSettings.directive('itemGroup', function() {
	return {
		transclude: true,
		templateUrl: '../config/settings-view/item-group.html'
	};
});