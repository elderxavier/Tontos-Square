(function() {
    'use strict';

    angular
        .module('starter.time')
        .factory('timeService', timeService);

    timeService.$inject = ['$http', 'ENV'];

    /* @ngInject */
    function timeService($http, ENV) {

        var service = {
            getNow: getNow
        };

        return service;

        function getNow() {
            return $http.get(ENV.baseUrl + '/api/time').then(function(time){
                return moment(time.BRT);
            });
        }
    }
})();
