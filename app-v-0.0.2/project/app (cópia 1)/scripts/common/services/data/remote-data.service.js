(function () {
	'use strict';

	angular
		.module('starter.common')
		.factory('remoteDataService', remoteDataService);

	remoteDataService.$inject = ['$http', '$q', '_'];

	/* @ngInject */
	function remoteDataService($http, $q, _) {
		var categoriesUrl = 'https://skounis.s3.amazonaws.com/mobile-apps/restaurant-ionic/categories.json';
		var featuredProductsUrl = 'https://skounis.s3.amazonaws.com/mobile-apps/restaurant-ionic/featured.json';
		var businessUrl = 'https://skounis.s3.amazonaws.com/mobile-apps/restaurant-ionic/business.json';
		var newsUrl = 'https://skounis.s3.amazonaws.com/mobile-apps/restaurant-ionic/news.json';
		var categories = [];
		var featuredProducts;
		var products = {};
		var articles = [];

		var service = {
			getCategories: getCategories,
			getProducts: getProducts,
			getProduct: getProduct,
			getFeaturedCategories: getFeaturedCategories,
			getFeaturedProducts: getFeaturedProducts,
			getFeaturedProduct: getFeaturedProduct,
			getBusiness: getBusiness,
			getArticles: getArticles,
			getArticle: getArticle
		};

		return service;

		function getArticles() {
			if (articles.length) {
				return $q.when(articles);
			}

			return $http.get(newsUrl).then(function(response) {
				articles = response.data.result;
				return articles;
			});
		}

		function getArticle(articleId) {
			return getArticles().then(function(articles) {
				return _.find(articles, function(article) {
					return article.guid == articleId;
				});
			});
		}

		function getBusiness(){
			return $http.get(businessUrl).then(function(response) {
				var business = response.data.result;
				return business;
			});
		}

		function getCategories() {
			if (categories && categories.length > 0) {
				return $q.when(categories);
			}

			return $http.get(categoriesUrl).then(function(response) {
				categories = response.data.result;
				return categories;
			});
		}

		function getFeaturedCategories() {
			return getCategories().then(function(categories) {
				return _.filter(categories, 'featured', true);
			});
		}

		function getProducts(categoryGuid) {
			var category = _.find(categories, function(category) {
				return category.guid === categoryGuid;
			});
			return $http.get(category.url).then(function(response) {
				products[categoryGuid] = response.data.result;
				return products[categoryGuid];
			});
		}

		function getFeaturedProducts() {
			if (featuredProducts) {
				return $q.when(featuredProducts);
			}

			return $http.get(featuredProductsUrl).then(function(response) {
				featuredProducts = response.data.result;
				return featuredProducts;
			});
		}

		function getProduct(categoryGuid, productGuid) {
			var promise;
			if (!products[categoryGuid]) {
				promise = getProducts(categoryGuid);
			} else {
				promise = $q.when(products[categoryGuid]);
			}

			return promise.then(function(products) {
				return _.find(products, function(product) {
					return product.guid === productGuid;
				});
			});
		}

		function getFeaturedProduct(productGuid) {
			var product = _.find(featuredProducts, function(product) {
				return product.guid === productGuid;
			});
			return $q.when(product);
		}
	}
})();
