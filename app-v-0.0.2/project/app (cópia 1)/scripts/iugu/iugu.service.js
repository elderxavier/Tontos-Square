(function() {
    'use strict';

    angular
        .module('starter.iugu')
        .factory('iuguService', iuguService);

    iuguService.$inject = ['dataService', '$http', '$q', '$rootScope'];


    var IUGU_API_URL = 'http://ec2-52-67-190-31.sa-east-1.compute.amazonaws.com/api/iugu/';

    /* @ngInject */
    function iuguService(dataService, $http, $q, $rootScope) {
        var service = {
            getUserPaymentMethods: getUserPaymentMethods,
            createCustomer: createCustomer,
            getUserPaymentMethodById: getUserPaymentMethodById,
            createPaymentMethod: createPaymentMethod,
            deletetUserPaymentMethodById: deletetUserPaymentMethodById,
            charge: charge
        };
        return service;


        //GET /api/iugu/customers/customer_id/payment_methods
        function getUserPaymentMethods() {
            var deferred = $q.defer();
            var userCustomerId = $rootScope.currentUser.iuguCustomerId;
            var paymentMethods = [];

            if (!userCustomerId) {
                deferred.resolve(paymentMethods);
            } else {
                $http.get(IUGU_API_URL + 'customers/' + userCustomerId + '/payment_methods').then(function(loadedPaymentMethods) {
                    deferred.resolve(loadedPaymentMethods.data);
                }).catch(function(error) {
                    console.log('error');
                    console.log(error);
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }


        //GET /api/iugu/customers/customer_id/payment_methods/payment_methods_ID
        function getUserPaymentMethodById(paymentMethodId) {
            var deferred = $q.defer();
            var userCustomerId = $rootScope.currentUser.iuguCustomerId;

            if (!userCustomerId) {
                deferred.reject('Customer not found');
            }

            $http.get(IUGU_API_URL + 'customers/' + userCustomerId + '/payment_methods/' + paymentMethodId).then(function(loadedPaymentMethod) {
                deferred.resolve(loadedPaymentMethod);
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        //POST /api/iugu/customers
        function createCustomer() {
            var deferred = $q.defer();

            var user = $rootScope.currentUser;
            var params = {};
            params.email = user.email;
            params.name = user.name;
            params.cpf = user.cpf;
            params.guid = user.$id;

            $http.post(IUGU_API_URL + 'customers', params).then(function(customer) {
                user.iuguCustomerId = customer.data.id;
                user.$save().then(function(savedUser) {
                    deferred.resolve(customer);
                }).catch(function(error) {
                    deferred.reject(error);
                });
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        //POST /api/iugu/customers/customer_id/payment_methods
        function createPaymentMethod(paymentMethod) {
            var deferred = $q.defer();

            var user = $rootScope.currentUser;
            var userCustomerId = $rootScope.currentUser.iuguCustomerId;

            var params = {};
            params.guid = user.$id;
            params.creditCardNumber = paymentMethod.creditCardNumber;
            params.verificationValue = paymentMethod.verificationValue;
            params.firstName = paymentMethod.firstName;
            params.lastName = paymentMethod.lastName;
            params.month = paymentMethod.month;
            params.year = paymentMethod.year;

            $http.post(IUGU_API_URL + 'customers/' + userCustomerId + '/payment_methods', params).then(function(savedPaymentMethod) {
                deferred.resolve(savedPaymentMethod);
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        //GET /api/iugu/customers/customer_id/payment_methods/payment_methods_ID
        function deletetUserPaymentMethodById(paymentMethodId) {
            var deferred = $q.defer();
            var userCustomerId = $rootScope.currentUser.iuguCustomerId;

            if (!userCustomerId) {
                deferred.reject('Customer not found');
            }

            $http.delete(IUGU_API_URL + 'customers/' + userCustomerId + '/payment_methods/' + paymentMethodId).then(function(result) {
                deferred.resolve(result);
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function charge() {
            var params = {};
            params.subAccountToken = '04b6e55d0a19f82a917439be4c5608c3';
            params.customer_payment_method_id = 'D252C665B7674088918E15875774B617';
            params.email = 'samirvarandas@gmail.com';

            params.items = [];

            var feijoada = {};
            feijoada.quantity = "1";
            feijoada.description = "Feijoada do bolinha";
            feijoada.price_cents = "2000";

            var macarronada = {};
            macarronada.quantity = "2";
            feijoada.description = "Macarronada do bolinha";
            feijoada.price_cents = "1000";

            var frete = {};
            frete.quantity = "1";
            feijoada.description = "Valor do frete";
            feijoada.price_cents = "5000";

            params.items.push(feijoada);
            params.items.push(macarronada);
            params.items.push(frete);

            params.payer = {};

            params.payer.cpf_cnpj = "369562888000";
            params.payer.name = "Samir Riad Varandas Fares";
            params.payer.phone_prefix = "11";
            params.payer.phone = "981462487";
            params.payer.email = "samirvarandas@gmail.com";

            params.payer.address = {};

            params.payer.address.street = "Avenida Aprígio Bezerra da Silva";
            params.payer.address.number = "1415";
            params.payer.address.city = "Taboão da Serra";
            params.payer.address.state = "São Paulo";
            params.payer.address.country = "Brasil";
            params.payer.address.zip_code = "06763040";


            $http.post(IUGU_API_URL + 'charge/', params).then(function(charge) {
                deferred.resolve(charge);
            }).catch(function(error) {
                deferred.reject(error);
            });
        }
    }
})();
