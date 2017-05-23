(function() {
    'use strict';

    angular
        .module('starter.orders')
        .factory('orderStatusService', orderStatusService);

    orderStatusService.$inject = ['dataService', 'fb', '$firebaseArray', '$firebaseObject', '$rootScope', 'localStorageService', 'statusKeys', '$q'];

    /* @ngInject */
    function orderStatusService(dataService, fb, $firebaseArray, $firebaseObject, $rootScope, localStorageService, statusKeys, $q) {

        var service = {
            createOrderStatus: createOrderStatus,
			getOrderStatusById: getOrderStatusById
        };

        return service;

        // ***************************************************************

        function createOrderStatus(keyNumber) {
            var deffered = $q.defer();

            keyNumber = keyNumber || 'key2';

            var orderStatus = createOrderStatusObject(keyNumber);
            var query = fb.child('order_status/');
            $firebaseArray(query).$add(orderStatus).then(function(data) {
                var query = fb.child('order_status/' + data.key);
                $firebaseObject(query).$loaded().then(dataService.initItem).then(function(orderStatus) {
                    deffered.resolve(orderStatus);
                }).catch(function(error) {
                    console.log(error);
                    deffered.reject(error);
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });
            return deffered.promise;
        }

        /*
          Cria o objeto que representa o status do pedido.
          Esse objeto é utilizado para popular a tabela /order_status.
          Detalhes do parâmetro key_number se encontram no módulo
          /scripts/orders/orders.module.js

          @author @dptole
          @type StatusKey = 'key1' | 'key2' | 'key3' | 'key4' | 'key5' | 'key6' | 'key7' # Valores possíveis.
          @type StatusObject = { "status_key": String, "timestamp": Number } # Campos necessários.
          @param {StatusKey} key_number
          @return {StatusObject}
        */
        function createOrderStatusObject(key_number) {
            var order_status = {};
            order_status.status_key = statusKeys[key_number].statusOrder;
            order_status.timestamp = moment().unix();
            return order_status;
        }

		function getOrderStatusById(orderStatusId) {
			var query = fb.child('order_status/' + orderStatusId);
			return $firebaseObject(query).$loaded().then(dataService.initItem);
		}
    }

})();
