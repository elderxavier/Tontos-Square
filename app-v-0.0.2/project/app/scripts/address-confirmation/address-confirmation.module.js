(function() {
    'use strict';

    angular
        .module('starter.address-confirmation', [
            'ionic',
            'ngCordova',
            'starter.common',
            'angular.viacep'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.address-confirmation', {
                    cache: false,
                    url: '/address-confirmation',
                    params:{
                        goBack: null
                    },
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/address-confirmation/address-confirmation.html',
                            controller: 'AddressConfirmationController as vm'
                        }
                    },
                    resolve: {
                        userAddresses: function(addressConfirmationService) {
                            return addressConfirmationService.getUserAddresses();
                        }
                    }
                });
        });
})();
