(function() {
	'use strict';

	angular
		.module('starter.first-interaction')
		.factory('firstInteractionService', firstInteractionService);

	firstInteractionService.$inject = ['dataService'];

	/* @ngInject */
	function firstInteractionService(dataService) {
		var service = {
			getFeaturedCategories: getFeaturedCategories,
			getFeaturedProducts: getFeaturedProducts
		};
		return service;

		// ***************************************************************

		function getFeaturedCategories() {
			return dataService.getFeaturedCategories();
		}

		function getFeaturedProducts() {
			return dataService.getFeaturedProducts();
		}
	}

})();