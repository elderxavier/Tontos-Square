(function() {
    'use strict';

    angular
        .module('starter.home.filter')
        .directive('filterPrice', function() {
            return {
                scope: true,
                restrict: 'E',
                replace: 'true',
                templateUrl: 'scripts/home/filter/directives/filter-price/filter-price.html'
            };
        });
})();
