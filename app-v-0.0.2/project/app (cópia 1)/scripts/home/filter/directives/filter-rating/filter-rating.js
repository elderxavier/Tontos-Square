(function() {
    'use strict';

    angular
        .module('starter.home.filter')
        .directive('filterRating', function() {
            return {
                scope: true,
                restrict: 'E',
                replace: 'true',
                templateUrl: 'scripts/home/filter/directives/filter-rating/filter-rating.html',
            };
        });
})();
