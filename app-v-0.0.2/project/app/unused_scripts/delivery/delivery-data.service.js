(function() {
	'use strict';

	angular
		.module('starter.restaurant-delivery')
		.factory('deliveryDataService', deliveryDataService);

	deliveryDataService.$inject = ['localStorageService'];

	/* @ngInject */
	function deliveryDataService(localStorageService) {
		var takeAwayKey = 'take-away-data';
		var homeDeliveryKey = 'home-delivery-data';

		var service = {
			saveTakeAwayData: saveTakeAwayData,
			getTakeAwayData: getTakeAwayData,
			saveHomeDeliveryData: saveHomeDeliveryData,
			getHomeDeliveryData: getHomeDeliveryData
		};
		return service;

		// ************************************************************

		function saveTakeAwayData(data) {
			localStorageService.set(takeAwayKey, data);
		}

		function getTakeAwayData() {
			return localStorageService.get(takeAwayKey);
		}

		function saveHomeDeliveryData(data) {
			localStorageService.set(homeDeliveryKey, data);
		}

		function getHomeDeliveryData() {
			return localStorageService.get(homeDeliveryKey);
		}
	}
})();
