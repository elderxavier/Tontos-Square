(function() {
    'use strict';

    angular
        .module('starter.restaurant-cart')
        .factory('restaurantCartService', restaurantCartService);

    restaurantCartService.$inject = [
    	'$state',
		'_',
		'localStorageService',
		'ionicToast',
		'ordersService',
		'chefsService',
		'popupService'];

    /* @ngInject */
    function restaurantCartService(
    	$state,
		_,
		localStorageService,
		ionicToast,
		ordersService,
		chefsService,
		popupService) {
        var restaurantCartKey = 'restaurant-cart';
        var cart = [];//localStorageService.get(restaurantCartKey) || [];
        var indexExistingItem = 0;

        var service = {
            addToCart: addToCart,
            showMyCart: showMyCart,
            deleteItem: deleteItem,
            changeQuantity: changeQuantity,
            getAll: getAll,
            getChef: getChef,
            chef: null,
            setLocalPlates: setLocalPlates,
            deleteItems: deleteItems,
            setTotal: setTotal,
            getTotal: getTotal
        };
        return service;

        // ********************************************************

        service.total = 0;

        // Remove apenas um item do carrinho //
        function setTotal (total) {
            service.total = total;
        }

        function getTotal() {
            return service.total;
        }

        function deleteItems() {
            cart = [];
            //localStorageService.set(restaurantCartKey, cart);
        }


        function deleteItem(itemToRemove) {
            _.remove(cart, function(item) {
                return item === itemToRemove;
            });
            //localStorageService.set(restaurantCartKey, cart);
        }

        // Mostra o carrinho //
        function showMyCart() {
            $state.go('app.restaurant-cart');
        }

        // Retorna os items do carrinho //
        function getAll() {
            return cart;
        }

        // Adiciona produtos no carrinho //
        function addToCart(plate, quantity) {
            var cartItem = {
                quantity: quantity,
                name: plate.name,
                category: plate.category,
                chef: plate.chef,
                description: plate.description,
                ingredients: plate.ingredients,
                price: plate.price,
                size: plate.size,
                currency: 'R$',
                id: plate.guid,
                minutes: plate.minutes,
                hours: plate.hours

            };

             // Variável de controle de produto existente no carrinho //
            var verify = verifyItem(cartItem, cart);

            /* Caso seja o primeiro produto do carrinho, não é verificado se existe, apenas adiciona;
               Caso não haja o produto no carrinho, adiciona-o */
            if ((verify == "nonExist" || verify == null) && cart.length < 5) {
                if (cartItem.quantity) {
                    saveToCart(cartItem, cartItem.quantity);
                    addChef(cartItem.chef);
                    ionicToast.show(cartItem.name +
                        '\' foi adicionado ao carrinho com sucesso!', 'bottom', false, 2000);
                    return;
                }
            }
            // Caso o produto já esteja no carrinho, é somado na quantidade //
            else if (verify == "exist") {
                service.changeQuantity(cart[indexExistingItem], 'sum');
                ionicToast.show('Prato já existente', 'bottom', false, 2000);
            } else if (cart.length == 5) {
                ionicToast.show('Atingiu a quantidade máxima de pratos!', 'bottom', false, 2000);
            }
            // Se houver chefe //
            else {
				popupService.open("Chefs diferentes!", "Você selecionou um prato de um outro chef.</br>Termine a compra ou limpe o carrinho.");
                // ionicToast.show('Termine a compra para adicionar um produto de outro chef', 'bottom', false, 2000);
            }
        }

        // Verifica se o item está contido no carrinho //
        function verifyItem(item, items) {
            var retorno = null
                // Se não há produtos no carrinho, não perde processamento iterando dentro do vetor //
            if (items.length > 0) {
                // Itera pelo vetor procurando itens existentes ou chefe existente //
                for (var x = 0; x < items.length; x++) {
                    // Caso haja prato //
                    if (item.id == items[x].id) {
                        retorno = "exist"
                        indexExistingItem = x
                        break
                    }
                    // Caso haja chef //
                    else if (verifyChef(item, service.chef)) {
                        retorno = "chef"
                        break
                    }
                    // Caso negativo, não há chefe nem prato
                    else {
                        retorno = "nonExist"
                    }
                }
            }
            return retorno
        }

        // Verifica se há algum chefe no carrinho //
        function verifyChef(cartItem, chef) {
            if (cartItem.chef.guid !== chef.guid) {
                return true;
            } else {
                return false;
            }
        }

        // Salva item no carrinho //
        function saveToCart(cartItem, quantity) {
            cartItem.quantity = quantity;
            cart.push(cartItem);

           // localStorageService.set(restaurantCartKey, cart);
        }

        // Muda a quantidade de itens do carrinho //
        function changeQuantity(cartItem, argument) {
            if (argument === 'sum') {
                cartItem.quantity = cartItem.quantity + 1;
              //  localStorageService.set(restaurantCartKey, cart);
            } else {
                cartItem.quantity = cartItem.quantity - 1;
            //    localStorageService.set(restaurantCartKey, cart);
            }
        }

        // Adiciona chefe na variável de controle //
        function addChef(chef) {
            service.chef = chef;
            ordersService.currentOrder.chef = chef;
        }

        // Retorna o chef do carrinho //
        function getChef() {
            return service.chef;
        }

        function setLocalPlates(plates) {
            var orderPlates = {};
            angular.forEach(plates, function(plate, key) {
                orderPlates[plate.id] = {
                    "quantity": plate.quantity,
                    "price": plate.price
                };
            });
            ordersService.currentOrder.plates = orderPlates;
            //localStorageService.set('currentOrder', ordersService.currentOrder);
        }
    }
})();
