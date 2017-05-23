(function () {
    'use strict';

    angular
            .module('starter.restaurant-cart')
            .controller('RestaurantCartController', RestaurantCartController);

    RestaurantCartController.$inject = [
        '$http',
        '$ionicListDelegate',
        '$scope',
        '$state',
        'periodsModalService',
        '_',
        'restaurantCartService',
        '$rootScope',
        '$ionicPopup',
        '$ionicLoading',
        'loggiService',
        'ordersService',
        'popupService',
        'ngDialog'];

    /* @ngInject */
    function RestaurantCartController(
            $http,
            $ionicListDelegate,
            $scope,
            $state,
            periodsModalService,
            _,
            restaurantCartService,
            $rootScope,
            $ionicPopup,
            $ionicLoading,
            loggiService,
            ordersService,
            popupService,
            ngDialog) {

        var vm = angular.extend(this, {
            items: [],
            deleteArray: [],
            changeQuantity: changeQuantity,
            getItemTotal: getItemTotal,
            total: 0,
            currency: null,
            getPeriodModal: getPeriodModal,
            showChefDetails:showChefDetails,
            deleteVar: false,
            showDelete: showDelete,
            addToDeleteArray: addToDeleteArray,
            est: 0,
            log: log,
            leadingZero: leadingZero,
            closePopup: closePopup,
            popup: null,
            deleteItem: deleteItem,
            deleteitenscart: [],
            deleteItens: deleteItens
        });

        (function activate() {
            loadItems();
            periodsModalService.init();
        })();

        // ********************************************************************

        // Função para loggar conteúdo direto do HTML //
        function log(params) {
            console.log(params);
        }

        function leadingZero(num) {
            if (num > 9) {
                return num
            } else {
                return '0' + num
            }
        }

        /* Adiciona os itens selecionados no vetor de itens a serem deletados;
         caso haja o mesmo item no vetor, ele é apagado do vetor */

        function addToDeleteArray(item) {            
            if (vm.deleteitenscart.indexOf(item) == -1) {
                vm.deleteitenscart.push(item);
            } else {
                vm.deleteitenscart.splice(vm.deleteArray.indexOf(item), 1);
            }
        }

        // Controla a variável para a exibição do 'ion-delete-button' //
        function showDelete(control) {
            if (vm.items.length == 0 && control) {
                popupService.open('Não há itens no carrinho!')
            } else {
                if (vm.deleteVar == false) {
                    vm.deleteVar = true
                } else {
                    vm.deleteVar = false
                }
            }
        }

        // Deleta os itens selecionados do carrinho //
        function deleteItemsInArray(itensToDelete) {
            for (var index = 0; index < itensToDelete.length; index++) {
                deleteItem(itensToDelete[index])
            }
            vm.deleteArray = [];
            showDelete(false);
        }

        // Carrega todos os pratos do carrinho //
        function loadItems() {
            vm.items = restaurantCartService.getAll();
            calculateTotalAmount();
        }

        // Calcula o total do carrinho //
        function calculateTotalAmount() {
            vm.currency = null;
            var total = 0;
            _.each(vm.items, function (item) {
                total += getItemTotal(item);
                vm.currency = item.currency;
            });

            restaurantCartService.setTotal(total);
            vm.total = total;
        }

        // Retorna o valor total de um prato, de acordo com a quantidade //
        function getItemTotal(item) {
            var total = item.price * item.quantity;
            if (item.options) {
                _.each(item.options, function (option) {
                    total += option.value * item.quantity;
                });
            }
            return total;
        }

        // Muda a quantidade de um prato //
        function changeQuantity(cartItem, argument) {
            if (argument === 'sum') {
                if (cartItem.quantity == 3) {
                    loadItems()
                } else {
                    restaurantCartService.changeQuantity(cartItem, argument);
                    loadItems()
                }
            } else {
                if (cartItem.quantity == 1) {
                    loadItems()
                } else {
                    restaurantCartService.changeQuantity(cartItem, argument);
                    loadItems()
                }
            }
        }

        // Deleta um prato //
        function deleteItem(item) {
            vm.popup = popupService.openChoice(
                    'Remover Produto',
                    '<p>Deseja remover <strong> ' + item.name + '</strong> do carrinho?</p>',
                    'Sim',
                    function (e) {
                        restaurantCartService.deleteItem(item);
                        loadItems();
                    },
                    'Não'
                    );
        }

        function showChefDetails() {
          var chef = restaurantCartService.getChef();
          if(chef ==null){
            popupService.open('Não há itens/chefs no carrinho!')
          }else{
            $state.go('app.chefdetail', {
                chefId: chef.$id
            });
          }
        }

        function closePopup() {
            vm.popup.close();
            // ngDialog.close();
        }
        
        // Abre o modal para a escolha do período de entrega //
        function getPeriodModal() {
            restaurantCartService.setLocalPlates(vm.items);
            periodsModalService.show();
        }
        //Deleta itens listados
        function deleteItens() {
            if (!vm.deleteitenscart.length) {
                popupService.open('Ops!', '<p>Você não selecionou <strong>nenhum</strong> produto</p>');
                return;
            }
            vm.popup = popupService.openChoice(
                    'Limpar carrinho',
                    '<p>Deseja remover <strong>os produtos selecionados</strong> carrinho?</p>',
                    'Sim',
                    function (e) {
                        for (var i = 0; i < vm.deleteitenscart.length; i++) {                            
                            restaurantCartService.deleteItem(vm.deleteitenscart[i]);
                        }                        
                        vm.showDelete(false);
                        loadItems();

                    },
                    'Não'
                    );
        }

    }
    // Model pra Checkbox    

})();
