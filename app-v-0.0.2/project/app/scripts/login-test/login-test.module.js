(function() {
	'use strict';

	angular
		.module('starter.login-test', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.login-test', {
					url: '/login-test',
					views: {
						'menuContent': {
							templateUrl: 'scripts/login-test/login-test.html',
							controller: 'LoginTestController as vm'
						}
					}
				});
		});
})();