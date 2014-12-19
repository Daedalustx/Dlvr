'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]);

videoApp.factory('test', function() {
	var serviceInstance = {};
	serviceInstance.data = 'test data';
	serviceInstance.settings = 'test setting';
	serviceInstance.writeData = function (value) {
		serviceInstance.data = value;
	};
	serviceInstance.writeSettings = function (value) {
		serviceInstance.settings = value;
	};
	serviceInstance.getData = function () {
		return serviceInstance.data;
	};
	serviceInstance.getSettings = function () {
		return serviceInstance.settings;
	};
	return serviceInstance;
});
			
videoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
	.when('/:projectUrl', {
		template: 'Loading',
		controller: 'SettingsCtrl',
		resolve: SettingsCtrl.resolveSettings
		
	})
	.otherwise({redirectTo: '/not-found'});
  
}]);

videoApp.controller('AppController', ['$rootScope', '$scope', '$http', '$routeParams', 'test', function($rootScope, $scope, $http, $routeParams, test) {
	//console.log(test);
	console.log('video app controller');
	$scope.data = test.getData();
	$scope.settings = test.getSettings();
	console.log($scope.data);
	console.log($scope.settings);
	console.log(test);
}]);

var SettingsCtrl = videoApp.controller('SettingsCtrl', function($scope, $http, $routeParams, $route, $location, settings, test) {
	console.log('settings controller');
	test.writeSettings(settings);
	console.log(test);
	$scope.settings = settings;
	$http.get(settings.projectRootPath + '/project.json').success(function(list) {
		$scope.data = list;
		$scope.videoList = list.videos;
		$scope.logo = list.clientLogo;
		$scope.path = list.previewPath;
		$scope.projectName = list.projectName;
		$scope.projectText = list.projectText;
		$scope.colHeaders = list.colHeaders;
		$scope.priority = list.colHeaders[0].sortable ? 'priority' : 'id';
		$scope.nightTheme = list.nightTheme;
		//console.log($scope.data);
		console.log('success callback');
		test.writeData(list);
		console.log(test);
		//$location.path('/green-pet/main');
	})
	.error( function() {
		alert("Could not find project.json");
	});
	
});

SettingsCtrl.resolveSettings = {
	settings: function($http, $q, $routeParams, $route) {
		var deferred = $q.defer();
		$http.get('config/' + $route.current.params.projectUrl + '.json').success( function (result) {
			deferred.resolve(result);
			console.log(result);
		})
		.error( function (errordata) {
			deferred.reject(errordata);
			console.log(errordata);
		});
		return deferred.promise;
	}
}
		
		
