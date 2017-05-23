(function() {
	'use strict';

	angular
		.module('starter.favorites')
		.controller('FavoritesController', FavoritesController);

	FavoritesController.$inject = ['$state', '$scope', 'favoritesService', 'favoritesSenderService', 'reviewService'];

	/* @ngInject */
	function FavoritesController($state, $scope, favoritesService, favoritesSenderService, reviewService) {
		var businessInfo;
		var vm = angular.extend(this, {
			items: [],
			deleteItem: deleteItem,
			sendFavorites: sendFavorites,
			showProductDetails: showProductDetails
		});

		(function activate() {
			loadItems();
			loadBusinessInfo();
		})();

		// ********************************************************************
		reviewService.showModal('scripts/review/review.html', $scope).then(function(modal){
			modal.show();
		})

		function loadBusinessInfo() {
			favoritesService.getBusiness()
				.then(function(business) {
					businessInfo = business;
				});
		}

		function loadItems() {
			vm.items = favoritesService.getAll();
		}

		function deleteItem(item) {
			favoritesService.deleteItem(item.guid);
			loadItems();
		}

		function sendFavorites() {
			debugger;
			favoritesSenderService.sendFavorites(businessInfo.email, vm.items);
		}

		function showProductDetails(product) {
			$state.go('app.product', {
				productId: product.guid,
				categoryId: product.categoryId
			});
		}
	}
})();
