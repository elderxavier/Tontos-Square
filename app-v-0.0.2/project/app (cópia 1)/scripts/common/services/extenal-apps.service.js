(function() {
	'use strict';

	angular
		.module('starter.common')
		.factory('externalAppsService', externalAppsService);

	externalAppsService.$inject = ['$window'];

	/* @ngInject */
	function externalAppsService($window) {
		var service = {
			openExternalUrl: openExternalUrl,
			openMapsApp: openMapsApp
		};
		return service;

		// ****************************************************************

		function openExternalUrl(url) {
			$window.open(url, '_system', 'location=yes');
			return false;
		}

		function openMapsApp(coords) {
			var q;
			if (ionic.Platform.isAndroid()) {
				q = 'geo:' + coords + '?q=' + coords;
			} else {
				q = 'maps://maps.apple.com/?q=' + coords;
			}
			q = q.replace(' ', '');
			$window.location.href = q;
		}
	}
})();
