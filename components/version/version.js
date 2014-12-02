'use strict';

angular.module('video1.version', [
  'video1.version.interpolate-filter',
  'video1.version.version-directive'
])

.value('version', '0.1');
