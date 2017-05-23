(function() {
    'use strict';

    angular
        .module('starter.chat', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.chat', {
                    url: '/chat/:orderId',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/chat/chat.html',
                            controller: 'ChatController as vm'
                        }
                    },
                    resolve: {
                        order: ['$stateParams', 'ordersService', 'chefsService', 'userService', function($stateParams, ordersService, chefsService, userService) {
                            return ordersService.getOrderById($stateParams.orderId).then(function(order) {
                                return userService.getUserById(order.user.guid).then(function(user) {
                                    return chefsService.getChefById(order.chef.guid).then(function(chef) {
                                        order.user = user;
                                        order.chef = chef;
                                        return order;
                                    });
                                });
                            });
                        }]
                    }
                });
        }).constant('messageSender', {
            'USER': 'USER',
            'CHEF': 'CHEF'
        });
})();
