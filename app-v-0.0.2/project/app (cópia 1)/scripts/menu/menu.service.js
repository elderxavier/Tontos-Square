(function() {
    'use strict';

    angular
        .module('starter.menu')
        .factory('menuService', menuService);

    menuService.$inject = ['_', 'dataService'];

    /* @ngInject */
    function menuService(_, dataService) {
        var service = {};
        return service;

    }
})();
