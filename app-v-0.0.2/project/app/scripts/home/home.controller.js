(function () {
	'use strict';

	angular
		.module('starter.home')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$ionicScrollDelegate', '$timeout', 'restaurantCartService', 'homePlatesService', 'homeService', '$ionicLoading', '_', 'laborService', 'filterService', '$state', 'categoryService', 'labor', 'laborModalService', 'homeSearchService', '$ionicSideMenuDelegate', 'plateService'];

	function HomeController($scope, $ionicScrollDelegate, $timeout, restaurantCartService, homePlatesService, homeService, $ionicLoading, _, laborService, filterService, $state, categoryService, labor, laborModalService, homeSearchService, $ionicSideMenuDelegate, plateService) {

		$scope.laborModal = laborModalService.modal;
		$scope.setFilterMode = laborModalService.setFilterMode;
		$scope.platecatmap = {};

		function resetScroll() {
			var scroll = $ionicScrollDelegate.$getByHandle('mainScroll');
			if (scroll) {
				scroll.resize();
				$timeout(function() {scroll.scrollTop(false);});
			}
		}
		filterService.init($scope);
		$scope.setup = function () {
			homeSearchService.clear();
			resetScroll();
		};

		categoryService.featured().then(function (categories) {
			$scope.categories = categories;
            $scope.currentCategory = {
				guid: '0-all',
				title: 'Destaques',
			};
			categoryService.setCurrent($scope.currentCategory);
		});

		$scope.set = function (categoryId) {
            $scope.setup();
            var currentCategory;

            currentCategory = {}
			if (categoryId === '0-all') {
				currentCategory.guid = categoryId;
                currentCategory.title = "Todos os produtos";
			} else {
				currentCategory = _.find($scope.categories, function (category) {
					return category.guid === categoryId;
				});
			}
			$scope.currentCategory = currentCategory;
			categoryService.setCurrent(currentCategory);
			resetScroll();
			homeService.emit('category');
		};

		$scope.labor = labor;

		laborService.on('change', function (labor) {
			$scope.labor = labor;
		});

		$scope.laborName = function(labor) {
		    if (labor.availability === 'at-hand') return 'Agora';
		    if (labor.availability === 'show-all') return 'Indiferente';
		    return labor.date.alias + ' - ' + labor.periods[0].alias;
        };

		$scope.openFilter = function () {
			filterService.open($scope);
		};

		$scope.showCart = function () {
			$state.go('app.restaurant-cart');
		};

		$scope.menuToggle = function () {
			laborModalService.modal.close();
			$ionicSideMenuDelegate.toggleLeft();
		};

		// FIXME: Unificar chamado de funções relacionadas ao prato em um lugar só (usar o controller mais acima)

		function updateFeaturedPlates(query) {
			$ionicLoading.show();
			plateService.getFeaturedPlates().then(function(plates) {
				$ionicLoading.hide();
				$scope.platecatmap = {};
				plates.filter(function(plate) {
					return !query || plate.name.toLocaleLowerCase().indexOf(query) !== -1;
				}).forEach(function(plate) {
					var list = $scope.platecatmap[plate.category];
					if (!list) list = $scope.platecatmap[plate.category] = [];
					if (list.length < 5) list.push(plate);
				});
			});
		}

		homeSearchService.on('quest', function(questedString) {
			if (questedString) questedString = questedString.trim().toLowerCase();
			updateFeaturedPlates(questedString || '')
		});

		homeSearchService.on('clear', function() {
			updateFeaturedPlates();
		});

		updateFeaturedPlates();

		$scope.showPlateDetails = homePlatesService.showPlateDetails;
		$scope.quickAddToCart = function (plate) {
			restaurantCartService.addToCart(plate, 1);
			$state.go('app.restaurant-cart');
		};
		$scope.goLabor = function() {
			laborModalService.modal.open();
		};
		$scope.setCheckoutMode = function(plate) {
			laborModalService.setCheckoutMode(plate);
		};
		$scope.isAtHand = function(plate) {
			return $scope.labor.matchWithAny(plate.chef.labors);
		};
	}
})();
