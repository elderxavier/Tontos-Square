(function() {
	'use strict';

	angular
		.module('starter.first-interaction', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.first-interaction', {
					url: '/first-interaction',
					views: {
						'menuContent': {
							templateUrl: 'scripts/first-interaction/first-interaction.html',
							controller: 'FirstInteractionController as vm'
						}
					},
					params:{
						successCallback: null
					}
				});
		});
})();
