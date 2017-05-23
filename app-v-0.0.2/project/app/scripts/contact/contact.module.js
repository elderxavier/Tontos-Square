(function() {
	'use strict';

	angular
		.module('starter.contact', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.contact', {
					url: '/contact',
					views: {
						'menuContent': {
							templateUrl: 'scripts/contact/contact.html',
							controller: 'ContactController as vm'
						}
					}
				});
		});
})();