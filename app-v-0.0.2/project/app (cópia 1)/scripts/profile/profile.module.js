(function() {
	'use strict';

	angular
		.module('starter.profile', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.profile', {
					url: '/profile',
					views: {
						'menuContent': {
							templateUrl: 'scripts/profile/profile.html',
							controller: 'ProfileController as vm'
						}
					}
				});
		});
})();
