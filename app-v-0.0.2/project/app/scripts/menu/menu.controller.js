(function() {
    'use strict';

    angular
        .module('starter.menu')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['categories', 'authService', '$state', 'ordersService'];

    /* @ngInject */
    function MenuController(categories, authService, $state, ordersService) {
        var vm = angular.extend(this, {
            categories: categories,
            logout: authService.logout,
            login: login,
            state : $state,
            getCurrentOrderId: getCurrentOrderId
        });

        function getCurrentOrderId(){
         return ordersService.currentOrder.guid
        }

        function login(){
            $state.go('app.first-interaction');
        }
    }
})();
