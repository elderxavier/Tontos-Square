(function() {
    'use strict';

    angular
        .module('starter.loggi')
        .factory('loggiService', loggiService);

    loggiService.$inject = ['$http', 'addressConfirmationService', '$q'];

    /* @ngInject */
    function loggiService($http, addressConfirmationService, $q) {
        var service = {
            estimative: estimative
        };
        return service;

        // ***************************************************************

        // Gera a estimativa de preço de entrega de origem até destino, via address.guid
        function estimative(originAddressId, destinationAddressId) {
            var deffered = $q.defer();
            addressConfirmationService.getAddressById(originAddressId).then(function(origin) {
                addressConfirmationService.getAddressById(destinationAddressId).then(function(destination) {
                    if (!origin.postcode || !destination.postcode) {
                        deffered.reject('Algum dos endereços é inválido');
                        return deffered.promise;
                    }
                    var url = 'https://staging.loggi.com/api/v1/endereco/estimativa/';
                    $http.post(url, {
                        "transport_type": 1,
                        "city": 1,
                        "addresses": [{
                            "by": "cep",
                            "query": {
                                "cep": origin.postcode,
                                "number": origin.number
                            }
                        }, {
                            "by": "cep",
                            "query": {
                                "cep": destination.postcode,
                                "number": destination.number
                            }
                        }]
                    }).then(function(response) {
                        deffered.resolve(response.data.normal.estimated_cost);
                    }, function(error){
                        deffered.reject(error);
                    });
                });
            });
            return deffered.promise;
        }
    }

})();
