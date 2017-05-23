(function () {
    'use strict';

    var app = angular.module('rating-stars');

    app.controller('RatingStarsController', RatingStarsController);

    RatingStarsController.$inject = ['$scope'];

    function RatingStarsController($scope) {
        
        $scope.integerToArray = function (value) {
            if (value) {
                return new Array(value | 0);
            }
            return new Array(0);
        };
        
        $scope.integerToArrayComplement = function (value) {
            var arrayLength = 5 - (value | 0);
            return new Array(arrayLength);
        }
    }

})();
