(function() {
	'use strict';

	angular
		.module('starter.common')
		.factory('simService', simService);

	simService.$inject = ['$q'];

	/* @ngInject */
	function simService($q) {
		var service = {
			getPhoneNumber: getPhoneNumber
		};
		return service;

		// ****************************************************************

		function getPhoneNumber() {
			var plugin = window.plugins && window.plugins.sim;

			if (!plugin) {
				return $q.resolve();
			}

			var deferred = $q.defer();

			plugin.getSimInfo(function(data) {
				if (data.phoneNumber) {
					deferred.resolve(data.phoneNumber);
				} else {
					deferred.resolve();
				}
			}, function() {
				deferred.resolve();
			});

			return deferred.promise;
		}
	}
})();
