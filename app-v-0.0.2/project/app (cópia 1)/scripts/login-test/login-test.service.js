(function() {
    'use strict';

    angular
        .module('starter.login-test')
        .factory('loginTestService', loginTestService);

    loginTestService.$inject = ['$q'];

    /* @ngInject */
    function loginTestService($q) {
        var service = {
            login: login
        };
        return service;

        // ***************************************************************

        function login(login, password) {
            console.log('Login: ' + login);
            console.log('password: ' + password);
            return $q.resolve(true);
        }
    }

})();
