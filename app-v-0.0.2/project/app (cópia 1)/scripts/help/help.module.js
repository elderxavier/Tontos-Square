(function() {
	'use strict';

	angular
		.module('starter.help', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.help', {
					url: '/help',
					views: {
						'menuContent': {
							templateUrl: 'scripts/help/help.html',
							controller: 'HelpController as vm'
						}
					}
				});
		});
})();
