(function() {
    'use strict';

    angular
        .module('starter.sale-flow')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$scope','$ionicModal', '$rootScope', 'ordersService', '$state', 'paymentModalService', 'viaCEP', 'paymentMethods', 'iuguService', 'restaurantCartService', '$ionicLoading', 'localStorageService'];

    /* @ngInject */
    function PaymentController($scope,$ionicModal, $rootScope, ordersService, $state, paymentModalService, viaCEP, paymentMethods, iuguService, restaurantCartService, $ionicLoading, localStorageService) {
        
        function init() {
            paymentModalService.paymentMethods = paymentMethods;
            paymentModalService.paymentMethodName = $state.params.paymentMethodName;
        }
        init();
        loadModal();
        var vm = angular.extend(this, {
            paymentAddress: {},
            select: select,
            isSelected: isSelected,
            destroy: destroy,
            modal: paymentModalService.init($scope),
            showModal:showModal,
            paymentMethods: paymentModalService.paymentMethods,
            selectedPaymentMethod: ordersService.currentOrder.paymentMethod,
            proceed: checkoutMock
        });

        function select(paymentMethod) {
            vm.selectedPaymentMethod = paymentMethod
            ordersService.currentOrder.paymentMethod = vm.selectedPaymentMethod;
        }

        function destroy(paymentMethod) {
            iuguService.deletetUserPaymentMethodById(paymentMethod.id).then(function(result) {
                var index = vm.paymentMethods.indexOf(paymentMethod);
                vm.paymentMethods.splice(index, 1);
            }).catch(function(error) {
                console.log(error);
            });
        }

        function isSelected(paymentMethod) {
            return (vm.selectedPaymentMethod) ? vm.selectedPaymentMethod.id === paymentMethod.id : false;
        }
        function loadModal() {
            $ionicModal.fromTemplateUrl('scripts/sale-flow/payment/payment-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
                .then(function(modal) {
                    $scope.modal = modal;
                });
        }
        function showModal() {
            $scope.modal.show();
        }
        function checkoutMock() {
            $ionicLoading.show();
            var order = ordersService.currentOrder;
            if (!order) {
                console.log("invalid order");
                $ionicLoading.hide();
                return;
            }
            ordersService.createOrder(ordersService.currentOrder).then(function(orderCreated) {
                $ionicLoading.hide();
                $state.go('app.sale-flow-tracking', {
                    orderId: localStorageService.get("currentOrder").guid
                });
                //clean cart
                restaurantCartService.deleteItems();
            }).catch(function(error) {
                console.log(error);
            });
        }
    }
})();
