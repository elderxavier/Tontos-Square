(function() {
    'use strict';

    angular
        .module('starter.help')
        .factory('helpService', helpService);

    helpService.$inject = ['dataService'];

    /* @ngInject */
    function helpService(dataService) {
        var service = {
            getModuleName: getModuleName
        };
        return service;

        // ***************************************************************

        function getModuleName() {
            return 'Ajuda';
        }
    }

})();
