(function () {
    'use strict';

    var app = angular
        .module('starter.home', [
			'ionic',
			'ngCordova',
			'starter.common',
			'mgcrea.ngStrap',
			'starter.home.filter',
            'starter.home.search'
		]);

    app.config(function ($stateProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/home/home.html',
                        controller: 'HomeController as Home'
                    }
                },
                resolve: {
                    labor: function ($stateParams, laborService) {
                        return laborService.getSelectedOrCreate();
                    }
                }
            })
            .state('app.home-filter', {
                url: '/filter',
                views: {
                    'menuContent': {
                        templateUrl: 'scripts/home/filter/filter.html',
                        controller: 'FilterController as vm'
                    }
                }
            });
    });

    app.directive('plateCard', function(){
        return {
            restrict: 'E',
            replace: 'false',
            templateUrl: 'scripts/home/plates/plate-card.html',
            scope: {
                plateObject: '=',
                quickAddToCartFunction: '&',
                goLaborFunction: '&',
                setCheckoutModeFunction: '&',
                showPlateDetailsFunction: '&',
                isAtHandFunction: '&'
            }
        }
    });

    app.directive('platesCarousel', function(){
        return {
            restrict: 'E',
            replace: 'false',
            templateUrl: 'scripts/home/plates/plates-carousel.html',
            scope: true
        }
    })
})();
