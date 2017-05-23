(function() {
    'use strict';

    angular
        .module('starter.search')
        .factory('searchService', searchService);

    searchService.$inject = ['dataService'];

    /* @ngInject */
    function searchService(dataService) {
        var service = {
            getModuleName: getModuleName
        };
        return service;

        // ***************************************************************

        function getModuleName() {
            return 'search';
        }
    }

})();
