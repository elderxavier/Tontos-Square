(function() {
	'use strict';

	angular
		.module('starter.chefdetail', [
			'ionic',
			'LocalStorageModule'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.chefdetail', {
					url: '/chefdetail',
					params: {
						chefId: null
					},
					views: {
						'menuContent': {
							templateUrl: 'scripts/chefdetail/chefdetail.html',
							controller: 'ChefDetailController as vm'
						}
					},
                    resolve: {
                        labor: function ($stateParams, laborService) {
                            return laborService.getSelectedOrCreate();
                        }
                    }   
				});
		});
})();