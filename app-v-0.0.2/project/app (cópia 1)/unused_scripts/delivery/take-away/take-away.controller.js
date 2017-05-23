(function() {
	'use strict';

	angular
		.module('starter.restaurant-delivery')
		.controller('TakeAwayController', TakeAwayController);

	TakeAwayController.$inject = [
		'restaurantCartService', 'restaurantOrderProcessor',
		'$rootScope', '$ionicPopup', 'restaurantInfoService', '$ionicHistory', '$state',
		'deliveryDataService', 'phoneNumber'];

	/* @ngInject */
	function TakeAwayController(
		restaurantCartService, restaurantOrderProcessor, $rootScope,
		$ionicPopup, restaurantInfoService, $ionicHistory, $state, deliveryDataService, phoneNumber) {
		var vm = angular.extend(this, {
			confirm: confirm,
			location: null,
			restaurant: null
		});

		(function activate() {
			loadRestaurantInfo();
		})();

		// ********************************************************************

		function loadRestaurantInfo() {
			restaurantInfoService.getRestaurantInfo().then(function(data) {
				vm.location = data.location;
				vm.restaurant = data.restaurant;
			});
		}

		function confirm() {
			var popup = createConfirmationPopup();

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				var items = restaurantCartService.getAll();
				var deliveryData = {
					fullname: result.fullname,
					email: result.email,
					phone: result.phone
				};
				restaurantOrderProcessor.sendTakeAwayConfirmation(items, vm.restaurant, deliveryData)
					.then(function() {
						deliveryDataService.saveTakeAwayData(deliveryData);
						restaurantCartService.flush();
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.home');
					}, function() {
						alert("Error when sending email");
					});
			});
		}
		
		function createConfirmationPopup() {
			var scope = $rootScope.$new();
			scope.data = deliveryDataService.getTakeAwayData() || {
				email: null,
				fullname: null,
				phone: phoneNumber
			};

			return {
				templateUrl: 'scripts/delivery/take-away/delivery-confirmation.html',
				title: 'Confirmation dialog',
				subTitle: 'Email',
				scope: scope,
				buttons: [{
					text: 'Cancel',
					onTap: function(e) {
						scope.data.canceled = true;
						return scope.data;
					}
				}, {
					text: '<b>Confirm</b>',
					type: 'button-positive',
					onTap: function(e) {
						var email = scope.data.email;
						if (email && email.length > 3) {
							return scope.data;
						} else {
							alert('Enter correct email');
							e.preventDefault();
						}
					}
				}]
			};
		}
	}
})();
