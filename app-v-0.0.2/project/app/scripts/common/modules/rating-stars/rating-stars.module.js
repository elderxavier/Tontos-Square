(function () {
    'use strict';
    
    var app = angular.module('rating-stars', []);
    
    app.directive('ratingStars', ratingStarsDirective);

    function ratingStarsDirective() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'scripts/common/modules/rating-stars/rating-stars.html',
            scope: {
                ratingValue: '@'
            }
        }
    }
})();
