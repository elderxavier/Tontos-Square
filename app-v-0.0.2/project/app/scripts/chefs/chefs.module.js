(function () {
    'use strict';

    angular.module('starter.chefs', ['ionic'])
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.chefs', {
                    url: '/chefs',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/chefs/chefs.html',
                        }
                    }
                });

        });

})();
