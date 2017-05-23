(function () {
    'use strict';

    var app = angular.module('starter.home.search', []);
    
    app.directive('homeSearch', [function() {
        return {
            templateUrl: 'scripts/home/search/search.html',
            replace: false,
            scope: true
        }
    }]);

})();
