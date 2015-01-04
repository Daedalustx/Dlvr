'use strict';

// Declare app level module which depends on views, and components
var videoApp = angular.module('video1', [
  'ngRoute',
  'video1.videoList',
  'video1.detail',
  'video1.version'
]);

videoApp.factory("projectSharingService", function () {
	return {
		settings: false,
		data: false,
		getProject: function(dataType) {
			if (dataType=='settings' && this.settings) {
				return this.settings;
			} 
			if (dataType=='data' && this.data) {
				return this.data;
			}
			return false;
		},
		setProject: function(data, type) {
		console.log('setProject');
			if (type=='settings') this.settings = data;
			if (type=='data') this.data = data;
			
		}
	};
});  

videoApp.factory("projectService", function($q, $http, projectSharingService){
    return {
        getProject: function(folder){
        	var data = projectSharingService.getProject('data');
        	if ( data )	return data;
            var projectPath = 'projects/' + folder + '/project.json?t=' + new Date().getTime();
				
			return $http.get(projectPath)
			.success( function( project ) {
				projectSharingService.setProject(project, 'data');
				return project;
			});
        }
    };
});

videoApp.factory("settingsService", function($route, $http, projectSharingService){
    return {
        getSettings: function(){
        	var settings = projectSharingService.getProject('settings');
			if ( settings ) return settings;
            return $http.get('projects/' + $route.current.params.projectUrl + '.json?t=' + new Date().getTime())
			.success( function (result) {
				projectSharingService.setProject(result, 'settings');
				return result;
			});
        }
    };
});

videoApp.factory("dataService", function($q, projectService, settingsService){
    return function () {
    	var project = {};
        return $q.when( settingsService.getSettings() )
        .then( function(settings) {
        	project.settings = settings.data ? settings.data : settings;
        })
        .then( function() {
        	return projectService.getProject(project.settings.projectRootPath);
        })
        .then( function(data) {
        	project.data = data.data ? data.data : data;
        	return project;
        });
        
    };
});

videoApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  	.when('/', {
  		templateUrl: 'dlvr.html'
  	})
	.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);

videoApp.controller('AppController', ['$scope', '$location', function($scope, $location) {
	console.log('video app controller');

	$scope.settings = {};
	$scope.settings.projectName = 'Dlvr';
	$scope.nightTheme = true;
	
	if ($location.path() == '/') return;

}]);

videoApp.directive('dlvrVideo', function() {
	return {
		templateUrl: 'components/dlvr-video.html',
		transclude: true,
		link: function (scope, el, attrs, ctrl) {
			
			var video = el.find('video');
			console.log(el);
			video.on('click', function(e) {
			
				var target = e.target.getBoundingClientRect();
			
				if (e.clientY < target.bottom - 35) { // avoids messing with controls in firefox
					e.preventDefault();
					if (!video[0].paused) {
						video[0].pause();
					} else {
						video[0].play();
					}
				}
			});
			if (scope.current.video.poster == 'frame') {
			console.log('frame');
				video.removeAttr('ng-attr-poster');
				video.one('loadedmetadata', function () {
					console.log('loadedmetadata');
					video[0].currentTime = scope.current.video.posterFrame;
				});
				video.one('play', function() {
					console.log('play');
					video[0].currentTime = 0;
					video[0].play();
				});
			} else if (scope.current.video.poster == 'default') {
				console.log('default');
				el.find('video').attr('poster', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
			} else {
				console.log('else - filename');
				var imgUrl = 'projects/' + scope.settings.projectRootPath + '/' + scope.data.previewPath + '/' + scope.current.video.posterFilename;
				console.log(imgUrl);
				el.find('video').attr({'poster': 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'style': 'background-image: url("' + imgUrl + '");'});
			}
			
			el.on('$destroy', function () {
				console.log('video destroyed - event listener removed');
				el.find('video').off();
			});
		}
	};
});


		
		
