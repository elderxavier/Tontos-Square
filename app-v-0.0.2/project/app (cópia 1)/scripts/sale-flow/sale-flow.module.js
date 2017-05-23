(function() {
    'use strict';

    angular
        .module('starter.sale-flow', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.sale-flow-address-selection', {
                    url: '/sale-flow/address-selection',
                    cache: false,
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/sale-flow/address-selection/address-selection.html',
                            controller: 'AddressSelectionController as vm'
                        }
                    },
                    resolve: {
                        userAddresses: function(addressConfirmationService) {
                            return addressConfirmationService.getUserAddresses();
                        }
                    }
                })
                .state('app.sale-flow-delivery', {
                    url: '/sale-flow/delivery',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/sale-flow/delivery/delivery.html',
                            controller: 'DeliveryController as vm'
                        }
                    }
                })
                .state('app.sale-flow-personal-info', {
                    url: '/sale-flow/personal-info',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/sale-flow/personal-info/personal-info.html',
                            controller: 'PersonalInfoController as vm'
                        }
                    }
                })
                .state('app.sale-flow-payment', {
                    url: '/sale-flow/payment',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/sale-flow/payment/payment.html',
                            controller: 'PaymentController as vm'
                        }
                    },
                    resolve: {
                        paymentMethods: ['iuguService', function(iuguService) {
                            return iuguService.getUserPaymentMethods();
                        }]
                    },
                    params: {
                        paymentMethodName: null
                    }
                })
                .state('app.sale-flow-tracking', {
                    url: '/sale-flow/tracking/:orderId',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/sale-flow/tracking/tracking.html',
                            controller: 'TrackingController as vm'
                        }
                    }
                });
        });
})();
