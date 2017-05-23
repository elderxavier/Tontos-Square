(function() {
	'use strict';

	angular
		.module('starter.categories')
		.controller('CategoriesController', CategoriesController);

	CategoriesController.$inject = ['$state', 'categoriesService', 'categories'];

	/* @ngInject */
	function CategoriesController($state, categoriesService, categories) {
		var vm = angular.extend(this, {
			categories: categories,
			showProducts: showProducts
		});

		function showProducts(category) {
			$state.go('app.plates', {
				categoryId: category.guid,
				categoryName: category.title
			});
		}
	}
})();