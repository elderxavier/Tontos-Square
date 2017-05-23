(function() {
	'use strict';

	angular
		.module('starter.contact-us', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.contact-us', {
					url: '/contact-us',
					views: {
						'menuContent': {
							templateUrl: 'scripts/contact-us/contact-us.html',
							controller: 'ContactUsController as vm'
						}
					}
				});
		});
})();
