(function() {
	'use strict';

	angular
		.module('starter.restaurant-delivery')
		.controller('HomeDeliveryController', HomeDeliveryController);

	HomeDeliveryController.$inject = [
		'restaurantCartService', 'restaurantOrderProcessor', 'restaurantInfoService', '$ionicHistory', '$state', 'deliveryDataService'];

	/* @ngInject */
	function HomeDeliveryController(restaurantCartService, restaurantOrderProcessor, restaurantInfoService, $ionicHistory, $state, deliveryDataService) {
		var restaurant;
		var vm = angular.extend(this, {
			submit: submit,
			form: deliveryDataService.getHomeDeliveryData() || {
				firstName: null,
				lastName: null,
				phoneNumber: null,
				zipCode: null,
				address: null
			}
		});

		(function activate() {
			loadRestaurantInfo();
		})();

		// ********************************************************************

		function loadRestaurantInfo() {
			restaurantInfoService.getRestaurantInfo().then(function(data) {
				restaurant = data.restaurant;
			});
		}

		function submit(form) {
			angular.forEach(form, function(obj) {
				if(angular.isObject(obj) && angular.isDefined(obj.$setDirty)) { 
					obj.$setDirty();
				}
			})
			
			if (form.$valid) {
				performHomeDelivery();
			}
		}

		function performHomeDelivery() {
			var items = restaurantCartService.getAll();
			restaurantOrderProcessor.performHomeDelivery(items, vm.form, starter.email).then(function() {
				deliveryDataService.saveHomeDeliveryData(vm.form);
				restaurantCartService.flush();
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.home');
			}, function() {
				alert("Error when sending email");
			});
		}
	}
})();
