(function() {
    'use strict';

    angular
        .module('starter.orders')
        .factory('ordersService', ordersService);

    ordersService.$inject = ['pushService', 'dataService', 'fb', '$firebaseArray', '$firebaseObject', '$rootScope', 'localStorageService', 'orderStatusService', '$q', 'addressConfirmationService', 'userService', '_', 'plateService', 'statusKeys', 'deliveryMethod'];

    /* @ngInject */
    function ordersService(pushService, dataService, fb, $firebaseArray, $firebaseObject, $rootScope, localStorageService, orderStatusService, $q, addressConfirmationService, userService, _, plateService, statusKeys, deliveryMethod) {
        var currentOrder = {};

        var service = {
            getUserOrders: getUserOrders,
            getOrderPlateById: getOrderPlateById,
            getPlateById: getPlateById,
            getOrderById: getOrderById,
            getChefById: getChefById,
            getAddressById: getAddressById,
            getOrderStatusById: getOrderStatusById,
            currentOrder: {},
            createOrder: createOrder,
            getUserPendingOrders: getUserPendingOrders,
            getUserInProgressOrders: getUserInProgressOrders,
            getUserFailedOrders: getUserFailedOrders,
            getUserCompletedOrders: getUserCompletedOrders,
            setToAcceptedByChef: setToAcceptedByChef,
            setFromInProgressToCompleted: setFromInProgressToCompleted,
            setFromPendingToInProgress: setFromPendingToInProgress,
            setOrderNextStatus: setOrderNextStatus,
            removeInProgressOrder: removeInProgressOrder,
            setOrderToMissedStatusKey: setOrderToMissedStatusKey,
            cancelOrder: cancelOrder,
            getOrderReview: getOrderReview
        };
        return service;

        // ***************************************************************

        function getUserFailedOrders(userID) {
            var deffered = $q.defer();
            var failedOrders = [];

            var query = fb.child('user_orders/' + userID + '/failed_orders/');

            var ref = $firebaseArray(query).$loaded().then(dataService.initArray).then(function(failedOrdersIds) {
                if (_.size(failedOrdersIds) === 0) {
                    deffered.resolve(failedOrders);
                }
                angular.forEach(failedOrdersIds, function(failedOrdersId, key) {
                    getOrderById(failedOrdersId.guid).then(function(order) {
                        failedOrders.push(order);
                        if (failedOrders.length === _.size(failedOrdersIds)) {
                            deffered.resolve(failedOrders);
                        }
                    }).catch(function(error) {
                        console.log(error);
                        deffered.reject(error);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }


        function getOrderReview(orderId) {
            var query = fb.child('reviews/').orderByChild('order').equalTo(orderId);
            return $firebaseArray(query).$loaded();
        }

        function getUserCompletedOrders(userID) {
            var deffered = $q.defer();
            var completedOrders = [];

            var query = fb.child('user_orders/' + userID + '/completed_orders/');

            var ref = $firebaseArray(query).$loaded().then(dataService.initArray).then(function(completedOrdersIds) {
                if (_.size(completedOrdersIds) === 0) {
                    deffered.resolve(completedOrders);
                }
                angular.forEach(completedOrdersIds, function(completedOrderId, key) {
                    getOrderById(completedOrderId.guid).then(function(order) {
                        getOrderReview(completedOrderId.guid).then(function(reviews) {
                            if (reviews.length === 1) {
                                order.review = reviews[0];
                            }
                            completedOrders.push(order);
                            if (completedOrders.length === _.size(completedOrdersIds)) {
                                deffered.resolve(completedOrders);
                            }

                        }).catch(function(error) {
                            console.log(error);
                            deffered.reject(error);
                        });

                    }).catch(function(error) {
                        console.log(error);
                        deffered.reject(error);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }


        function getOrderById(orderId) {
            var deffered = $q.defer();
            var query = fb.child('orders/' + orderId);
            $firebaseObject(query).$loaded().then(dataService.initItem).then(function(order) {
                orderStatusService.getOrderStatusById(order.current_order_status).then(function(orderStatus) {
                    addressConfirmationService.getAddressById(order.address).then(function(address) {
                        userService.getUserById(order.user).then(function(user) {
                            plateService.getOrderPlates(orderId).then(function(orderPlates) {
                                getChefById(orderPlates[0].chef).then(function(chef) {
                                    order.chef = chef;
                                });
                                order.currentOrderStatus = orderStatus;
                                order.address = address;
                                order.user = user;
                                order.plates = orderPlates;
                                var chatQuery = fb.child('order_chat/' + orderId + '/chat');
                                order.chat = $firebaseObject(chatQuery);
                                deffered.resolve(order);
                            }).catch(function(error) {
                                console.log(error);
                                deffered.reject(error);
                            });
                        }).catch(function(error) {
                            console.log(error);
                            deffered.reject(error);
                        });
                    }).catch(function(error) {
                        console.log(error);
                        deffered.reject(error);
                    });
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


        function getUserOrders(user) {
            var query = fb.child('user_orders/' + user);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function getOrderPlateById(id) {
            var query = fb.child('order_plates/' + id);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function getPlateById(id) {
            var query = fb.child('plates/' + id);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function getChefById(chef) {
            var query = fb.child('chefs/' + chef);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function getAddressById(address) {
            var query = fb.child('addresses/' + address);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function getOrderStatusById(status) {
            var query = fb.child('order_status/' + status);
            return $firebaseObject(query).$loaded().then(dataService.initItem)
        }

        function createOrder() {

            var order = {},
                plates, chefEmail;

            return orderStatusService.createOrderStatus().then(function(orderStatus) {
                if (service.currentOrder.deliveryMethod === deliveryMethod.WITHDRAW) {
                    order.address = service.currentOrder.chef.currentAddress;
                } else {
                    order.address = service.currentOrder.address.guid;
                }
                order.chef = service.currentOrder.chef.guid;
                order.current_order_status = orderStatus.guid;
                order.delivery_method = service.currentOrder.deliveryMethod;
                order.delivery_time = service.currentOrder.delivery_time;
                order.order_statuses = {};
                order.order_statuses[orderStatus.guid] = true;
                order.paymentMethod = service.currentOrder.paymentMethod;
                order.total = service.currentOrder.total;
                order.user = $rootScope.currentUser.$id;
                return $firebaseArray(fb.child('orders/')).$add(order);
            }).then(function(savedOrder) {
                order.guid = savedOrder.key;
                localStorageService.set('currentOrder', order);
                plates = service.currentOrder.plates;
                chefEmail = service.currentOrder.chef.email;
                service.currentOrder = order;
                return setOrderPlates(order.guid, plates);
            }).then(function() {
                return setUserChefOrders(order.guid, order.chef, order.user);
            }).then(function() {
                return setToPending(order.guid, order.chef, order.user);
            }).then(function() {
                if (chefEmail) {
                    return pushService.sendMessage(chefEmail, 'Novo pedido', 'Você recebeu um novo pedido. Abra o aplicativo para aceitá-lo.');
                }
            }).then(function() {
                return service.currentOrder;
            }).catch(function(error) {
                console.log(error);
                throw error;
            });
        }

        function setToPending(orderId, chefId, userId) {
            var deffered = $q.defer();
            var query = fb.child('chef_orders/' + chefId + '/pending_orders/' + orderId);
            var ref = $firebaseObject(query);
            ref.$value = true;
            ref.$save().then(function(result) {
                var query = fb.child('user_orders/' + userId + '/pending_orders/' + orderId);
                var ref = $firebaseObject(query);
                ref.$value = true;
                ref.$save().then(function(result) {
                    deffered.resolve({ orderId: true });
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

        function setUserChefOrders(orderId, chefId, userId) {
            var deffered = $q.defer();
            var query = fb.child('user_orders/' + userId + '/orders/' + orderId);
            var ref = $firebaseObject(query);
            ref.$value = true;
            ref.$save().then(function(result) {
                var query = fb.child('chef_orders/' + chefId + '/orders/' + orderId);
                var ref = $firebaseObject(query);
                ref.$value = true;
                ref.$save().then(function(result) {
                    deffered.resolve({ orderId: true });
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

        function setOrderPlates(orderId, plates) {
            var deffered = $q.defer();
            var query = fb.child('order_plates/' + orderId + '/plates/');
            var ref = $firebaseObject(query);

            angular.forEach(plates, function(plate, key) {
                ref[key] = {
                    "price": plate.price,
                    "quantity": plate.quantity
                };
            });
            ref.$save().then(function(result) {
                deffered.resolve(result);
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function getUserPendingOrders(userID) {
            var deffered = $q.defer();
            var pendingOrders = [];

            var chefId = $rootScope.currentUser.$id;

            var query = fb.child('user_orders/' + userID + '/pending_orders/');

            var ref = $firebaseArray(query).$loaded().then(dataService.initArray).then(function(pendingOrdersIds) {
                if (_.size(pendingOrdersIds) === 0) {
                    deffered.resolve(pendingOrders);
                }
                angular.forEach(pendingOrdersIds, function(pendingOrderId, key) {
                    getOrderById(pendingOrderId.guid).then(function(order) {
                        pendingOrders.push(order);
                        if (pendingOrders.length === _.size(pendingOrdersIds)) {
                            deffered.resolve(pendingOrders);
                        }
                    }).catch(function(error) {
                        console.log(error);
                        deffered.reject(error);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function getUserInProgressOrders(userID) {
            var deffered = $q.defer();
            var inProgressOrders = [];

            var query = fb.child('user_orders/' + userID + '/in_progress_orders/');

            var ref = $firebaseArray(query).$loaded().then(dataService.initArray).then(function(inProgressOrdersIds) {
                if (_.size(inProgressOrdersIds) === 0) {
                    deffered.resolve(inProgressOrders);
                }
                angular.forEach(inProgressOrdersIds, function(inProgressOrdersId, key) {
                    getOrderById(inProgressOrdersId.guid).then(function(order) {
                        inProgressOrders.push(order);
                        if (inProgressOrders.length === _.size(inProgressOrdersIds)) {
                            deffered.resolve(inProgressOrders);
                        }
                    }).catch(function(error) {
                        console.log(error);
                        deffered.reject(error);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        /*
         Altera um pedido do status pending_orders para in_progress_orders na tabela /chef_orders/<ID_DO_CHEF>.

         Esta função:
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /chefs_orders/<ID_DO_CHEF>/in_progress_orders.
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /user_orders/<ID_DO_CHEF>/in_progress_orders.
         - Remove o <ID_DO_PEDIDO> da tabela /chef_orders/<ID_DO_CHEF>/pending_orders/<ID_DO_PEDIDO>.
         - Remove o <ID_DO_PEDIDO> da tabela /user_orders/<ID_DO_CHEF>/pending_orders/<ID_DO_PEDIDO>.

         @author @dptole
         @param {String} orderId
         @param {String} chefId
         @return {Promise}
         */
        function setFromPendingToInProgress(orderId, chefId, userId) {
            var deffered = $q.defer();

            serChefOrderFromPendingToInProgress(orderId, chefId).then(function(data) {
                serUserOrderFromPendingToInProgress(orderId, userId).then(function(data) {
                    deffered.resolve(data);
                });
            });
            return deffered.promise;
        }

        /*
         Altera um pedido do status in_progress_orders para completed_orders na tabela /chef_orders/<ID_DO_CHEF>.

         Esta função:
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /chefs_orders/<ID_DO_CHEF>/completed_orders.
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /user_orders/<ID_DO_CHEF>/completed_orders.
         - Remove o <ID_DO_PEDIDO> da tabela /chef_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.
         - Remove o <ID_DO_PEDIDO> da tabela /user_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.

         @author @Samir Fares
         @param {String} orderId
         @param {String} chefId
         @return {Promise}
         */
        function setFromInProgressToCompleted(orderId, chefId, userId) {
            var deffered = $q.defer();

            setChefOrderFromInProgressToCompleted(orderId, chefId).then(function(data) {
                setUserOrderFromInProgressToCompleted(orderId, userId).then(function(data) {
                    deffered.resolve(data);
                });
            });
            return deffered.promise;
        }

        /*
         Altera um pedido do status in_progress_orders ou pending_orders para failed_orders na tabela /chef_orders/<ID_DO_CHEF>.

         Esta função:
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /chefs_orders/<ID_DO_CHEF>/failed_orders.
         - Remove o <ID_DO_PEDIDO> da tabela /chef_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.
         - Remove o <ID_DO_PEDIDO> da tabela /chef_orders/<ID_DO_CHEF>/pending_orders/<ID_DO_PEDIDO>.
         - Adiciona o objeto {<ID_DO_PEDIDO>: true} na tabela /user_orders/<ID_DO_CHEF>/failed_orders.
         - Remove o <ID_DO_PEDIDO> da tabela /user_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.
         - Remove o <ID_DO_PEDIDO> da tabela /user_orders/<ID_DO_CHEF>/pending_orders/<ID_DO_PEDIDO>.

         @author @Samir Fares
         @param {String} orderId
         @param {String} chefId
         @return {Promise}
         */
        function setToFailed(orderId, chefId, userId) {
            var deffered = $q.defer();
            setToFailedChefOrders(orderId, chefId).then(function(data) {
                setToFailedUserOrders(orderId, userId).then(function(data) {
                    deffered.resolve(data);
                });
            });
            return deffered.promise;
        }

        /*
         Altera um pedido para o status ACCEPTED_BY_CHEF na tabela /orders.
         O parâmetro order.$id deve representar um item na tabela /orders.

         @author @dptole
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {OrderObject} order
         @return {Promise}
         */
        function setToAcceptedByChef(order) {
            // Criar o status ACCEPTED_BY_CHEF e atualizar o pedido para que o
            // cliente possa acompanhar a mudança de status.
            //
            return orderStatusService.createOrderStatus('key3').then(function(orderStatus) {
                return setToOrderStatus(order, orderStatus.$id);
            });
        }

        /*
         Método genérico para alterar o status de um pedido na tabela /orders.
         O parâmetro orderStatusId deve representar um item na tabela /order_status.

         @author @dptole
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {OrderObject} order
         @param {String} orderStatusId
         @return {Promise}
         */
        function setToOrderStatus(order, orderStatusId) {
            return fb.child('/orders/' + order.$id).update({
                current_order_status: orderStatusId
            }).then(function(data) {
                var query = fb.child('/orders/' + order.$id + '/order_statuses/' + orderStatusId);
                var ref = $firebaseObject(query);
                ref.$value = true;
                ref.$save();
                return data;
            })
        }

        /*
         Cria o próximo status na tabela /order_status de acordo com status do pedido atual.
         Atualiza o status do pedido atual com o novo status criado na tabela /orders.
         Recupera o pedido atualizado da tabela /orders.

         Caso não seja possível determinar o próximo status do pedido atual:
         Recupera o pedido do banco de dados; Mantendo o mesmo retorno {Promise}.

         @author @dptole
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {OrderObject} order
         @return {Promise}
         */
        function setOrderNextStatus(order) {
            var nextStatus = getNextStatus(order);

            if (nextStatus.found === false) {
                console.log('Não foi possível determinar o próximo estado do pedido:', order);
                return getOrderById(order.guid);
            }

            return setOrderToStatusKey(order, nextStatus.key);
        }

        /*
         Altera o pedido para o status ORDER_MISSED.
         Isso acontece depois que o tempo para aceitar um pedido é expirado.

         @author @dptole
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {String} chefId
         @param {OrderObject} order
         @return {Promise}
         */
        function setOrderToMissedStatusKey(chefId, order) {
            var query = fb.child('chef_orders/' + chefId + '/pending_orders/');
            return $firebaseObject(query).$remove().then(function() {
                return setOrderToStatusKey(order, 'key8');
            });
        }

        /*
         Função genérica que altera o status do pedido para qualquer statusKey informada.

         @author @dptole
         @type StatusKey = "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8"
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {OrderObject} order
         @param {StatusKey} statusKey
         @return {Promise}
         */
        function setOrderToStatusKey(order, statusKey) {
            return orderStatusService.createOrderStatus(statusKey).then(function(orderStatus) {
                return setToOrderStatus(order, orderStatus.$id);
            }).then(function() {
                return getOrderById(order.guid);
            }).catch(function(error) {
                console.log(error);
                return error;
            });
        }

        function cancelOrder(order) {
            var deffered = $q.defer();

            orderStatusService.createOrderStatus('key7').then(function(orderStatus) {
                setToOrderStatus(order, orderStatus.$id).then(function() {
                    setToFailed(order.guid, order.chef.guid, order.user.guid).then(function(data) {
                        deffered.resolve(data);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });
            return deffered.promise;
        }


        /*
         Retorna o objeto que representa o próximo status do pedido atual.
         Esta função depende da constante {statusKeys} do módulo orders/orders.module.js.

         @author @dptole
         @type NextStatusObject = statusKeys["key2"] | statusKeys["key3"] | statusKeys["key4"] | statusKeys["key5"] | statusKeys["key6"] | statusKeys["key7"] | statusKeys["key8"]
         @type NextStatus = {  "found": Boolean,
         "status": NextStatusObject | undefined,
         "key": NextStatusKey | undefined
         } # Campos existentes.
         @type NextStatusKey = "key2" | "key3" | "key4" | "key5" | "key6" | "key7" | "key8"
         @type OrderObject = { "$id": String } # Campos necessários.
         @param {OrderObject} order
         @return {NextStatus}
         */
        function getNextStatus(order) {
            var statusCode = Object.keys(statusKeys).reduce(function(acc, key) {
                return (
                    acc === 1 ? { status: statusKeys[key], key: key } : acc
                ) || (
                    order.currentOrderStatus.status_key === statusKeys[key].statusOrder ? 1 : acc
                )
            }, 0);

            return statusCode === 0 || statusCode === 1 ? { found: false } : { found: true, status: statusCode.status, key: statusCode.key };
        }

        /*
         Remove o pedido da tabela /chef_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.
         Remove o pedido da tabela /user_orders/<ID_DO_CHEF>/in_progress_orders/<ID_DO_PEDIDO>.

         @author @dptole
         @param {String} chefId
         @param {String} orderId
         @return {Promise}
         */
        function removeInProgressOrder(chefId, orderId, userId) {
            var query_remove = fb.child('/chef_orders/' + chefId + '/in_progress_orders/' + orderId);
            return $firebaseObject(query_remove).$remove().then(function(data) {
                var query_remove = fb.child('/user_orders/' + userId + '/in_progress_orders/' + orderId);
                return $firebaseObject(query_remove).$remove();
            });
        }

        function setToFailedChefOrders(orderId, chefId) {
            var deffered = $q.defer();

            var query = fb.child('/chef_orders/' + chefId + '/failed_orders/' + orderId);
            var failedOrder = $firebaseObject(query);
            failedOrder.$value = true;
            failedOrder.$save().then(function(result) {
                var query_remove = fb.child('/chef_orders/' + chefId + '/in_progress_orders/' + orderId);
                return $firebaseObject(query_remove).$remove().then(function() {
                    var query_remove = fb.child('/chef_orders/' + chefId + '/pending_orders/' + orderId);
                    return $firebaseObject(query_remove).$remove().then(function() {
                        deffered.resolve(result);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function setToFailedUserOrders(orderId, userId) {
            var deffered = $q.defer();

            var query = fb.child('/user_orders/' + userId + '/failed_orders/' + orderId);
            var failedOrder = $firebaseObject(query);
            failedOrder.$value = true;
            failedOrder.$save().then(function(result) {
                var query_remove = fb.child('/user_orders/' + userId + '/in_progress_orders/' + orderId);
                return $firebaseObject(query_remove).$remove().then(function() {
                    var query_remove = fb.child('/user_orders/' + userId + '/pending_orders/' + orderId);
                    return $firebaseObject(query_remove).$remove().then(function() {
                        deffered.resolve(result);
                    });
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }


        function setChefOrderFromInProgressToCompleted(orderId, chefId) {
            var deffered = $q.defer();

            var query = fb.child('/chef_orders/' + chefId + '/completed_orders/' + orderId);
            var completedOrder = $firebaseObject(query);
            completedOrder.$value = true;
            completedOrder.$save().then(function(result) {
                var query_remove = fb.child('/chef_orders/' + chefId + '/in_progress_orders/' + orderId);

                return $firebaseObject(query_remove).$remove().then(function() {
                    deffered.resolve(result);
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function setUserOrderFromInProgressToCompleted(orderId, userId) {
            var deffered = $q.defer();

            var query = fb.child('/user_orders/' + userId + '/completed_orders/' + orderId);
            var completedOrder = $firebaseObject(query);
            completedOrder.$value = true;
            completedOrder.$save().then(function(result) {
                var query_remove = fb.child('/user_orders/' + userId + '/in_progress_orders/' + orderId);

                return $firebaseObject(query_remove).$remove().then(function() {
                    deffered.resolve(result);
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function serChefOrderFromPendingToInProgress(orderId, chefId) {
            var deffered = $q.defer();

            var query = fb.child('/chef_orders/' + chefId + '/in_progress_orders/' + orderId);
            var inProgressOrder = $firebaseObject(query);
            inProgressOrder.$value = true;
            inProgressOrder.$save().then(function(result) {
                var query_remove = fb.child('/chef_orders/' + chefId + '/pending_orders/' + orderId);

                return $firebaseObject(query_remove).$remove().then(function() {
                    deffered.resolve(result);
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function serUserOrderFromPendingToInProgress(orderId, userId) {
            var deffered = $q.defer();

            var query = fb.child('/user_orders/' + userId + '/in_progress_orders/' + orderId);
            var inProgressOrder = $firebaseObject(query);
            inProgressOrder.$value = true;
            inProgressOrder.$save().then(function(result) {
                var query_remove = fb.child('/user_orders/' + userId + '/pending_orders/' + orderId);

                return $firebaseObject(query_remove).$remove().then(function() {
                    deffered.resolve(result);
                });
            }).catch(function(error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }



    }
})();
