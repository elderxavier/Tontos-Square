(function() {
    'use strict';

    angular
        .module('starter.sale-flow')
        .controller('TrackingController', TrackingController);

    TrackingController.$inject = [
        '$state',
        '$scope',
        '$ionicModal',
        'statusKeys',
        'ordersService',
        'fb',
        '$firebaseObject',
        '$firebaseArray',
        '$stateParams',
        'deliveryMethod',
        'orderStatusService',
        '$rootScope',
        'ngDialog',
        '$ionicPopup',
        'popupService',
        'chefsService'
    ];

    /* @ngInject */
    function TrackingController(
        $state,
        $scope,
        $ionicModal,
        statusKeys,
        ordersService,
        fb,
        $firebaseObject,
        $firebaseArray,
        $stateParams,
        deliveryMethod,
        orderStatusService,
        $rootScope,
        ngDialog,
        $ionicPopup,
        popupService,
        chefsService) {
        var vm = angular.extend(this, {
            cancelPurchase: cancelPurchase,
            status: undefined,
						voltaHome:voltaHome,
            userUnreadMessagesCount: $firebaseObject(fb.child('order_chat/' + $stateParams.orderId + '/chat/user_unread_messages_count')),

            /*
              Exponho a propriedade orderId para a view.
              Essa propriedade já é utilizada na função chatWithChef e
              provavelmente será necessária na função cancelPurchase.

              @author @dptole
            */
            orderId: $stateParams.orderId,
            orderDeliveryMethod: null,
            chatWithChef: chatWithChef,
            showHeader: false,
            hideHeader: hideHeader,
            headerTitle: '',
            headerText: ''
        });

        init();

        function init() {
            /*
              Surgiu a necessidade de recuperar o método de entrega do pedido
              pois a mensagem do status pode variar.

              @author @dptole
            */
            var query = fb.child('orders/' + vm.orderId + '/delivery_method');
            $firebaseObject(query).$loaded().then(function(data) {
                vm.orderDeliveryMethod = data.$value;
            }).then(function() {
                var query = fb.child('orders/' + vm.orderId + '/current_order_status');
                $firebaseObject(query).$watch(function(data) {
                    ordersService.getOrderById(vm.orderId).then(function(newOrder) {
                        ordersService.getOrderStatusById(newOrder.current_order_status).then(function(status) {
                            setStatus(status);
                        });
                    });
                });
            });

            activateFailedOrders();
        }

        function activateFailedOrders() {
            var userId = $rootScope.currentUser.$id;
            var query = fb.child('user_orders/' + userId + '/failed_orders/');
            $firebaseArray(query).$watch(function(data) {
                if (data.event === 'child_added' && data.key === vm.orderId) {
                    ordersService.getOrderById(vm.orderId).then(function(newOrder) {
                        chefsService.getChefById(newOrder.chef).then(function(chef) {
                            showHeader(chef.name);
                        });
                    });
                }
            });
        }

        function showHeader(chefName) {
            vm.showHeader = true;
            vm.headerTitle = 'Ops...';
            vm.headerText = 'O Chef ' + chefName + ' não aceitou seu pedido a tempo. Tente novamente ou peça de outro Chef.';
        }

        function hideHeader() {
            vm.showHeader = false;
            vm.headerTitle = '';
            vm.headerText = '';

            $state.go('app.home');
        }

        function setStatus(status) {
            if (status.status_key === statusKeys.key1.statusOrder) {
                vm.status = statusKeys.key1.statusCode;
                $scope.orderText = statusKeys.key1.statusName;
            } else if (status.status_key === statusKeys.key2.statusOrder) {
                vm.status = statusKeys.key2.statusCode;
                $scope.orderText = statusKeys.key2.statusName;
            } else if (status.status_key === statusKeys.key3.statusOrder) {
                vm.status = statusKeys.key3.statusCode;
                $scope.orderText = statusKeys.key3.statusName;
            } else if (status.status_key === statusKeys.key4.statusOrder) {
                vm.status = statusKeys.key4.statusCode;
                $scope.orderText = statusKeys.key4.statusName;
            } else if (status.status_key === statusKeys.key5.statusOrder) {
                vm.status = statusKeys.key5.statusCode;
                $scope.orderText = vm.orderDeliveryMethod === deliveryMethod.WITHDRAW ? 'Pedido disponível para retirada' : statusKeys.key5.statusName;
            } else if (status.status_key === statusKeys.key6.statusOrder) {
                vm.status = statusKeys.key6.statusCode;
                $scope.orderText = statusKeys.key6.statusName;
            }
        }

        function showModal(tpl) {

            $scope.modal = popupService.openChoice(
                'Cancelar pedido',
                'Tem certeza de que deseja cancelar o seu pedido?',
                'Sim!',
                function(e) {
                    $scope.cancelOrder();
                },
                'Não'
            );
            /*$ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.openModal();
            });*/
        }

        $scope.openModal = function() {
            // ngDialog.open({
            // 	template: tpl,
            // 	scope: $scope,
            // 	className: 'ngdialog-theme-default'
            // });
            // $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.close()
                // ngDialog.close();
                // $scope.modal.hide();
        };

        /*
          Função invocada quando o usuário seleciona "Sim" no modal
            scripts/sale-flow/tracking/cancel-modal.html

          @author @dptole
          @return {undefined}
        */
        $scope.cancelOrder = function() {
            $rootScope.$broadcast('loading:show');
            ngDialog.close();
            // $scope.closeModal();
            ordersService.getOrderById(vm.orderId).then(function(data) {
                ordersService.cancelOrder(data).then(function() {
                    $state.go('app.home');
                }).catch(function(error) {
                    console.log(error);
                }).finally(function() {
                    $rootScope.$broadcast('loading:hide');
                });
            });
        };

        function cancelPurchase() {
            showModal('scripts/sale-flow/tracking/cancel-modal.html');
        }

        /*
          Redireciona o usuário para a tela de chat com o chef.

          @author @dptole
          @param {String} chatId
          @return {undefined}
        */
				function voltaHome(){
					$state.go('app.home');
				}

        function chatWithChef(orderId) {
            $state.go('app.chat', {
                orderId: orderId
            });
        }
    }
})();
