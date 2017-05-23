(function() {
    'use strict';
    
    var app = angular.module('starter.home.search');
    
    app.service('homeSearchService', homeSearchService);
    
    homeSearchService.$inject = ['EventEmitterService'];
    
    function homeSearchService (EventEmitterService) {
        var service = {}
        angular.extend(service, new EventEmitterService);
        
        service.clear = function() {
            service.emit('clear', []);
        }
        
        return service;
    }
    
})();