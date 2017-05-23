(function() {
	'use strict';

	angular
		.module('starter.plate')
		.controller('PlatesController', PlatesController);

	PlatesController.$inject = ['$state', 'plateService'];

	/* @ngInject */
	function PlatesController($state, plateService) {
		var categoryId = $state.params.categoryId;
		var categoryName = $state.params.categoryName;

		var vm = angular.extend(this, {
			plates: [],
			showPlateDetails: showPlateDetails,
			showCart: showCart,
			category: categoryName
		});

		(function activate() {
			loadPlates();
		})();

		// ******************************************************

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function loadPlates() {
			return plateService.getPlates(categoryId).then(function(data) {
				vm.plates = data;
			});
		}

		function showPlateDetails(plateId) {
			$state.go('app.plate', {
				categoryId: categoryId,
				plateId: plateId
			});
		}
	}
})();