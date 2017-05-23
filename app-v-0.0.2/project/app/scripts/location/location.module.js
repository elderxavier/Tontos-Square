(function() {
	'use strict';

	angular
	.module('starter.location', [
		'ionic',
		'ngCordova',
		'starter.common',
		'angular.viacep'
		])
	.config(function($stateProvider) {
		$stateProvider
		.state('app.location', {
			url: '/location',
			cache: false,
			views: {
				'menuContent': {
					templateUrl: 'scripts/location/location.html',
					controller: 'LocationController as vm'
				}
			},
			resolve: {
                        userAddresses: function(addressConfirmationService) {
                            return addressConfirmationService.getUserAddresses();
                        }
								}
		});
	});
})();
