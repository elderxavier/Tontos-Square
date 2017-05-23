(function() {
    'use strict';

    angular
        .module('starter.labor')
        .factory('LaborClassService', LaborClassService);

    LaborClassService.$inject = ['_'];

    function LaborClassService (_) {

        function Labor (date, periods) {
            this.date = date;
            this.periods = periods;
        }

        Labor.prototype.matchWithAny = function (labors) {
            var self = this;
            // console.log(labors);
            // console.log(self.date);
            var laborOfTheDay = _.find(labors, function (laborFromList) {
                return laborFromList.date.day === self.date.day;
            });

            if (!laborOfTheDay) return;

            return _.find(laborOfTheDay.periods, function (period) {
                return period.has(self.periods[0].start);
            });
        }

        Labor.prototype.matchWithAnyForPeriodModal = function (labors) {
            var self = this;
            var laborOfTheDay = _.find(labors, function (laborFromList) {
                return laborFromList.date.day === self.date.day;
            });

            if (!laborOfTheDay) return;

            return _.find(laborOfTheDay.periods, function (period) {
                return period.turn === self.periods[0];
            });
        }

        Labor.prototype.matchDayWithAny = function(labors) {
            var self = this;
            var laborOfTheDay = _.find(labors, function (laborFromList) {
                return laborFromList.date.day === self.date.day;
            });

            return laborOfTheDay ? true : false;
        }

        Labor.prototype.matchPeriodWithAny = function(periods, turn) {
            var self = this;
            var periodIsAvailable = _.find(periods, function (periodFromList) {
                return periodFromList.turn === turn;
            });
            return periodIsAvailable ? true : false;
        }

        return Labor;
    }
})();
