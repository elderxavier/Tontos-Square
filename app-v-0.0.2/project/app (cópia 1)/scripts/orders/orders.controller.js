(function() {
    'use strict';

    angular
        .module('starter.orders')
        .controller('OrdersController', OrdersController);

    OrdersController.$inject = ['$state',
        'contactService',
        '$scope',
        '$rootScope',
        'ordersService',
        '$ionicLoading',
        'fb',
        '$firebaseArray'
    ];

    /* @ngInject */
    function OrdersController($state,
        contactService,
        $scope,
        $rootScope,
        ordersService,
        $ionicLoading,
        fb,
        $firebaseArray) {
        var vm = angular.extend(this, {
            viewName: 'Histórico de pedidos',
            user: $rootScope.currentUser.$id,
            completedOrdersArray: [],
            inProgressOrdersArray: [],
            pendingOrders: [],
            inProgressOrders: [],
            completedOrders: [],
            failedOrders: [],
            toggleExpanded: toggleExpanded,
            isExpanded: isExpanded,
            expanded: null,
            chatWithChef: chatWithChef,
            getItemsTotal: getItemsTotal,
            createReview: createReview,
            showChefDetails:showChefDetails,
            gotoTracking: gotoTracking
        });
        function showChefDetails(id) {
          console.log(id);
            $state.go('app.chefdetail', {
                chefId: id
            });

        }
        function activatePendingOrders() {
            var userId = $rootScope.currentUser.$id;
            var query = fb.child('/user_orders/' + userId + '/pending_orders');

            $firebaseArray(query).$watch(function(data) {
                ordersService.getUserPendingOrders(vm.user).then(function(pendingOrders) {
                    vm.pendingOrders = pendingOrders;
                    vm.inProgressOrdersArray = [];
                    vm.inProgressOrdersArray = vm.inProgressOrdersArray.concat(vm.pendingOrders);
                    vm.inProgressOrdersArray = vm.inProgressOrdersArray.concat(vm.inProgressOrders);
                });
            });
        }

        function activateInProgressOrders() {
            var userId = $rootScope.currentUser.$id;
            var query = fb.child('/user_orders/' + userId + '/in_progress_orders');

            $firebaseArray(query).$watch(function(data) {
                ordersService.getUserInProgressOrders(vm.user).then(function(inProgressOrders) {
                    vm.inProgressOrders = inProgressOrders;
                    vm.inProgressOrdersArray = [];
                    vm.inProgressOrdersArray = vm.inProgressOrdersArray.concat(vm.pendingOrders);
                    vm.inProgressOrdersArray = vm.inProgressOrdersArray.concat(vm.inProgressOrders);
                });
            });
        }


        function activateCompletedOrders() {
            var userId = $rootScope.currentUser.$id;
            var query = fb.child('/user_orders/' + userId + '/completed_orders');

            $firebaseArray(query).$watch(function(data) {
                ordersService.getUserCompletedOrders(vm.user).then(function(completedOrders) {
                    vm.completedOrders = completedOrders;
                    vm.completedOrdersArray = [];
                    vm.completedOrdersArray = vm.completedOrdersArray.concat(vm.completedOrders);
                    vm.completedOrdersArray = vm.completedOrdersArray.concat(vm.failedOrders);
                });
            });
        }

        function activateFailedOrders() {
            var userId = $rootScope.currentUser.$id;
            var query = fb.child('user_orders/' + userId + '/failed_orders');

            $firebaseArray(query).$watch(function(data) {
                ordersService.getUserFailedOrders(vm.user).then(function(failedOrders) {
                    vm.failedOrders = failedOrders;
                    vm.completedOrdersArray = [];
                    vm.completedOrdersArray = vm.completedOrdersArray.concat(vm.completedOrders);
                    vm.completedOrdersArray = vm.completedOrdersArray.concat(vm.failedOrders);
                });
            });
        }

        (function activate() {
            //TODO refactor these method to dont fetching data multiple times
            activatePendingOrders();
            activateInProgressOrders();
            activateCompletedOrders();
            activateFailedOrders();
        })();

        // Calcula o total dos pratos //
        function getItemsTotal(items) {
            var itemTotal = 0;
            for (var x = 0; x <= items.length - 1; x++) {
                itemTotal += items[x].price * items[x].quantity;
            }
            return itemTotal;
        }

        // Alterna entre os itens expandidos //
        function toggleExpanded(item) {
            if (isExpanded(item)) {
                vm.expanded = null;
            } else {
                vm.expanded = item;
            }
        }

        // Verifica se o item está expandido //
        function isExpanded(item) {
            return vm.expanded === item;
        }
        /*
         Redireciona o usuário para a tela de chat com o chef.

         @author @dptole
         @param {String} chatId
         @return {undefined}
         */
        function chatWithChef(orderId) {
            $state.go('app.chat', {
                orderId: orderId
            });
        }

        function createReview(order) {
            $rootScope.$broadcast('createReview', order);
        }

        function gotoTracking(orderID){
            $state.go('app.sale-flow-tracking', {
                    orderId: orderID
                });
        }
    }

})();
