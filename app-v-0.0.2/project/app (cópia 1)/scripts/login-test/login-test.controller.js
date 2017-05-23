(function() {
    'use strict';

    angular
        .module('starter.login-test')
        .controller('LoginTestController', LoginTestController);

    LoginTestController.$inject = ['$ionicPopup', '$state', 'loginTestService'];

    /* @ngInject */
    function LoginTestController($ionicPopup, $state, loginTestService) {
        var vm = angular.extend(this, {
            login: login
        });

        function login() {
            var onSuccess = function() {
                console.log('resolved');
                $state.go('home');
            };

            var onError = function() {
                console.log('rejected');
                $ionicPopup.alert({
                    title: 'Login failed :(',
                    template: 'Please try again.'
                });
            };

            loginTestService.login(vm.username, vm.password)
                .then(onSuccess, onError);
        }
    }
})();
