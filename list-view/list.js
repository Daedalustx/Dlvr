'use strict';

var listModule = angular.module('video1.videoList', ['ngRoute']);

listModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:projectUrl/:groupUrl', {
    templateUrl: 'list-view/list.html',
    controller: 'VideoListCtrl'
  });
}])

.controller('VideoListCtrl', [ '$rootScope', '$scope', '$http', '$route', '$routeParams', 'nestedFilter', function($rootScope, $scope, $http, $route, $routeParams, nestedFilter) {
	$rootScope.$on('$routeChangeStart', function () {
		//console.log('routeChangeStart list');
	});
	$scope.$on('$routeChangeSuccess', function () {
		//console.log('routeChangeSuccess list');
	});
	var numColumns = 0;
	$scope.list = $routeParams.groupUrl;
	$scope.$watch('data', function(newVal) {
		if (newVal) {
			angular.forEach($scope.videoList, function(item) {
				if (item.groupUrl == $scope.list && $scope.list != 'main') {
					$scope.listName = item.name;
					$scope.listDescription = item.groupDescription || '';
				} else {
				//	$scope.listName = 'main';
				}
			});
			angular.forEach($scope.colHeaders, function(header) {
				if ( header.display && header.index != 0 && header.index !=4 ) numColumns++;
			});	
			$scope.variableColumn = function () {
				return 'col-' + numColumns;
			};	
		}
	});
	
}])

.filter('nested', function() {
	return function(videos, list) {
		if ( videos ) {
			var filtered = [];
			for (var i=0; i < videos.length; i++) {
				if (videos[i].belongsTo == list || (videos[i].isGroup && list=='main')) {
					filtered.push(videos[i]);
				}
			};
			return filtered;
		}
	};
});
	
listModule.directive('projectText', function() {
	return {
		controller: function($scope) {
			
		},
		link: function (scope, el) {
			scope.$watch('data', function (newVal) {
				if (newVal) {
					//console.log('write project text');
					if ( scope.list == 'main' ) {
						scope.introText = scope.projectText;
					} else {
						scope.introText = "<h2>" + scope.listName + "</h2>" + scope.listDescription;
					}
					return el.append(scope.introText);
				}
			});
		}
	};
});

listModule.directive('breadcrumb', function() {
	return {
		link: function(scope, el) {
			scope.$watch('data', function(newVal) {
				if (newVal) {
					var breadcrumbs = [];
					if (scope.list == 'list-item' && scope.listName) {
						breadcrumbs[1] = "<a href='" + scope.settings.projectId + "/" + scope.video.belongsTo + "'>" + scope.listName + "</a> &raquo;";
					} 
					if ( scope.list !== 'main' ) {
						breadcrumbs[0] = "<a href='" + scope.settings.projectId + "/main'>Home</a>";
					} else {
						scope.breadcrumbs = "";
					}
			
					el.append(breadcrumbs.join(' &raquo; '));
				}
			});
		},
		template: "<span>{{breadcrumbs}}</span>"
	};
});

listModule.directive('colHeaders', function() {
	return {
		restrict: 'E',
		controller: function($scope, $routeParams, $timeout, $interval) {
			$scope.getTitle = function(title, group, column) {
				var numVideos = $scope.videoList.length,
					showHeaderText = false;
				for (var i=0; i < numVideos; i++) {
					if ($scope.videoList[i].belongsTo == group && !$scope.videoList[i].isGroup && $scope.videoList[i][column]) {
						showHeaderText = true;
					}
				};
				return showHeaderText ? title : '';
			};
			$scope.getHeader = function(header) {
				var group = angular.isDefined($routeParams.groupUrl) ? $routeParams.groupUrl : null;
				
				switch(header.index) {
					case 0:
						return header.display === true ? "<span class='index col'>" + header.title + "</span>" : "";
					case 1:
						return "<span class='col " + $scope.variableColumn() + "'>" + header.title + "</span>";
					case 2:
						if ( header.display === true ) {
							return "<span class='col " + $scope.variableColumn() + "'>" + $scope.getTitle(header.title, group, 'optional1') + "</span>";
						} else {
							return "";
						};
					case 3:
						if ( header.display === true ) {
							return "<span class='col " + $scope.variableColumn() + "'>" + $scope.getTitle(header.title, group, 'optional2') + "</span>";
						} else {
							return "";
						};
					case 4:
						if ( header.display === true ) {
							return "<span class='download col'>" + $scope.getTitle(header.title, group, 'downloadFilename') + "</span>";
						} else {
							return "";
						}
					default:
						return;
				};
			};
		},
		link: function (scope, el) {
			scope.$watch('data', function(newVal) {
				if (newVal) {
					var headers = "";
					for (var i=0; i < 5; i++) {
				
						headers += scope.getHeader(scope.colHeaders[i]);
					};
					el.append(headers);
				}
			});
		}
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
listModule.directive('index', function() {
	return {
		transclude: true,
		template: '<span ng-if="data.colHeaders[0].display">{{getIndex($index, video.priority)}}</span>'
	};
});
listModule.directive('titleField', function() {
	return {
		transclude: true,
		templateUrl: 'list-view/title.html',
		controller: function($scope) {
			$scope.video.numChildren = 0;
			for (var i = 0; i < $scope.data.videos.length; i++) {
				if ( $scope.data.videos[i].belongsTo == $scope.video.groupUrl ) $scope.video.numChildren++;
			};
		}
	};
});
listModule.directive('optional1', function() {
	return {
		transclude: true,
		controller: function ($scope) {
			$scope.optional1 = $scope.video.optional1 || '' ;
		},
		link: function (scope, el) {
			if (scope.data.colHeaders[2].display) {
				el.append('<span>' + scope.optional1 + '</span>');
			} else {
				el.remove();
			}
		}
	};
});
listModule.directive('optional2', function() {
	return {
		transclude: true,
		controller: function ($scope) {
			$scope.optional2 = $scope.video.optional2 || '' ;
		},
		link: function (scope, el) {
			if (scope.data.colHeaders[3].display) {
				el.append('<span>' + scope.optional2 + '</span>');
			} else {
				el.remove();
			}
		}
	};
});
listModule.directive('downloadField', function() {
	return {
		transclude: true,
		templateUrl: 'list-view/download-field.html'
	};
});
	

