(function () {
    'use strict';

    var app = angular.module('starter.home');
    app.factory('homePlatesService', homePlatesService);

    homePlatesService.$inject = ['$state'];

    function homePlatesService($state) {
        var service = { selected : true };
        
        var showPlateDetails = function (plate) {
            service.selected = plate;
            
            $state.go('app.plate', {
                plateId: plate.guid
            });
        }
        
        service.showPlateDetails = showPlateDetails;
        return service;
    }
})();
