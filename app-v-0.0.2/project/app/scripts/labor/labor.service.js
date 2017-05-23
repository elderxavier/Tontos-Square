(function () {
    'use strict';

    angular
        .module('starter.labor')
        .factory('laborService', laborService);

    laborService.$inject = ['EventEmitterService', 'periodsService', '$q', 'DateClassService', 'LaborClassService'];

    /* @ngInject */
    function laborService(EventEmitterService, periodsService, $q, DateClassService, LaborClassService) {
        var selected;
        var service = {};

        angular.extend(service, new EventEmitterService);

        var get = function () {
            return $q(function(resolve) { resolve(selected); });
        }

        var getSelectedOrCreate = function () {
            if (selected) return get();

            return getCurrentPeriod();
        }

        var getCurrentPeriod = function () {
            return periodsService.now().then(function (period) {
                var date = period.isPreviousThat((new DateClassService()).hour()) ? new DateClassService({
                    from: 'tomorrow'
                }) : new DateClassService({
                    from: 'today'
                });

                selected = new LaborClassService(date, [period]);
                selected.availability = 'at-hand';
                return selected;
            });
        }

        var change = function (fresh) {
            selected.date = fresh.date;
            selected.periods = fresh.periods;
            selected.availability = fresh.availability;
            service.emit('change', [selected]);
        };

        service.close = close;
        service.getSelectedOrCreate = getSelectedOrCreate;
        service.change = change;
        service.getCurrentPeriod = getCurrentPeriod;

        return service;
    }
})();
