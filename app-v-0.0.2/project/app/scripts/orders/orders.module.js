(function() {
    'use strict';

    angular
        .module('starter.orders', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.orders', {
                    url: '/orders',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/orders/orders.html',
                            controller: 'OrdersController as vm'
                        }
                    }
                });
        })
        .constant('statusKeys', {
            'key1': {
                'statusOrder': 'PENDING_ORDER',
                'statusName': 'Seu pedido foi enviado ao chef. Aguarde a confirmação do chef.',
                'statusCode': 1
            },
            'key2': {
                'statusOrder': 'PAYMENT_APPROVED',
                'statusName': 'Seu pedido foi enviado ao chef. Aguarde a confirmação do chef.',
                'statusCode': 2
            },
            'key3': {
                'statusOrder': 'ACCEPTED_BY_CHEF',
                'statusName': 'O Chef aceitou seu pedido e o pagamento foi efetuado',
                'statusCode': 3
            },
            'key4': {
                'statusOrder': 'BEING_PREPARED',
                'statusName': 'Seu pedido já está sendo preparado pelo chef.',
                'statusCode': 4
            },
            'key5': {
                'statusOrder': 'BEING_DELIVERED',
                'statusName': 'Seu pedido já está à caminho da sua casa. Garanta que alguém possa recebe-lo.',
                'statusNameWithdraw': 'Seu pedido está pronto para retirada',
                'statusCode': 5
            },
            'key6': {
                'statusOrder': 'ORDER_COMPLETED',
                'statusName': 'Pedido concluido.',
                'statusCode': 6
            },
            'key7': {
                'statusOrder': 'ORDER_CANCELED',
                'statusName': 'Pedido cancelado.',
                'statusCode': 7
            },
             'key8': {
                'statusOrder': 'ORDER_MISSED',
                'statusName': 'Pedido expirado.',
                'statusCode': 8
            }
        })
        .constant('deliveryMethod', {
            'DELIVERY': 'DELIVERY',
            'DELIVERY_BY_CHEF': 'DELIVERY_BY_CHEF',
            'DELIVERY_BY_EATER': 'DELIVERY_BY_EATER',
            'WITHDRAW': 'WITHDRAW'
        });
})();
