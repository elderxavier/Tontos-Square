(function() {
	'use strict';

	angular
		.module('starter.favorites', [
			'ionic',
			'LocalStorageModule'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.favorites', {
					url: '/favorites',
					views: {
						'menuContent': {
							templateUrl: 'scripts/favorites/favorites.html',
							controller: 'FavoritesController as vm'
						}
					}
				});
		});
})();
