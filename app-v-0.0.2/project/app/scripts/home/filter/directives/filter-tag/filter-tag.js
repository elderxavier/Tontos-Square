(function() {
    'use strict';

    angular
        .module('starter.home.filter')
        .directive('filterTag', function() {
            return {
                scope: true,
                restrict: 'E',
                replace: 'true',
                templateUrl: 'scripts/home/filter/directives/filter-tag/filter-tag.html'
            };
        });
})();
