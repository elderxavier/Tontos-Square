(function() {
    'use strict';

    angular
        .module('starter.profile.edit', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
			$stateProvider
				.state('app.profile.edit', {
					url: '/profile/edit',
					views: {
						'menuContent': {
							templateUrl: 'scripts/profile/profile-edit/profile-edit.html',
							controller: 'ProfileEditController as vm'
						}
					}
				});
		});
})();
