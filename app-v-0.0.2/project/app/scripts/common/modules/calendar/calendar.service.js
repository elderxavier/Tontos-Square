(function () {
    'use strict';

    angular
        .module('calendar')
        .factory('calendarService', calendarService);

    calendarService.$inject = ['moment', 'CalendarClassService', 'EventEmitterService'];

    /* @ngInject */

    function calendarService(moment, CalendarClassService, EventEmitterService) {

        var calendar = new CalendarClassService();
        var monthPointer = 0;
        var service = {};
        angular.extend(service, new EventEmitterService);

        var previous = function () {
        	calendar.previousMonth();
        }

        var next = function () {
        	calendar.nextMonth();
        }

        service.init = calendar.init;
        service.rows = calendar.rows;
        service.month = calendar.month;
        service.year = calendar.year;
        service.next = next;
        service.previous = previous;
        service.pickDate = calendar.pickDate;
        service.addRule = calendar.addRule;
        service.removeRule = calendar.removeRule;

        service.desactivePastDates =  function() {
            service.addRule(pastDatesNotAllowed);
        }

        function pastDatesNotAllowed (date) {
            return shouldBeFalse(calendar.isPast(date))

            function shouldBeFalse(booleanVal) {
                return booleanVal === false;
            }
        }

        return service;
    }
})();
