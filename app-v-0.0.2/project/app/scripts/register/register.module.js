(function() {
    'use strict';

    angular
        .module('starter.register', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.register', {
                    url: '/register',
                    params: {
                        chefId: null,
                    },
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/register/register.html',
                            controller: 'RegisterController as vm'
                        }
                    },
                    params: {
                        successCallback: null
                    }
                });
        });
})();
