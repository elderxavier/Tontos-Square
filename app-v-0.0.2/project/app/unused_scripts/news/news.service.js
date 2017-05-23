(function() {
	'use strict';

	angular
		.module('starter.news')
		.factory('newsService', newsService);

	newsService.$inject = ['dataService'];

	/* @ngInject */
	function newsService(dataService) {
		var service = {
			all: all,
			get: get
		};
		return service;

		// *******************************************************

		function all() {
			return dataService.getArticles();
		}

		function get(articleId) {
			return dataService.getArticle(articleId);
		}
	}
})();
