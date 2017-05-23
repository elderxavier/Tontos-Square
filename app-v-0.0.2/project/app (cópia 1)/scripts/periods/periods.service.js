(function() {
    'use strict';

    var app = angular.module('starter.periods');

    app.factory('periodsService', periodsService);

    periodsService.$inject = ['moment', '_', 'dataService', 'fb', '$firebaseArray'];

    function periodsService(moment, _, dataService, fb, $firebaseArray) {

        var periodAbstract = (function() {
            var isPreviousThat = function(time) {
                return this.end < time;
            };
            var isAfterThat = function(time) {
                return this.start > time;
            };
            var has = function(time) {
                return (time >= this.start) && (time <= this.end)
            };
            var hours = function() {
                var list = [];
                var hour = parseInt(this.start);
                while (hour < parseInt(this.end)) {
                    var str = hour + ':00';
                    if (hour < 10) str = '0' + str;
                    list.push(str);
                    hour++;
                }
                return list;
            };
            return { isPreviousThat: isPreviousThat, isAfterThat: isAfterThat, has: has, hours: hours }
        })();

        var load = function() {
            var query = fb.child('periods');
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(function(periodsList) {
                var periods = periodsList;
                angular.forEach(periods, function(period) {
                    angular.extend(period, periodAbstract);
                });
                return periods;
            });
        };

        var order = function() {
            return load().then(function(periods) {
                var ordered = _.sortBy(periods, function(period) {
                    return period.start;
                });
                return ordered;
            });
        };

        var next = function() {
            return load()
                .then(order)
                .then(getNext);

            function getNext(periods) {
                var present = moment().format('HH:mm');
                var _next = _.find(periods, function(period) {
                    return period.isAfterThat(present);
                });
                return _next ? _next : periods[0];
            }
        };


        var now = function() {
            return load()
                .then(order)
                .then(getNow);

            function getNow(periods) {
                var present = moment().format('HH:mm');
                var _now = _.find(periods, function(period) {
                    return period.has(present);
                });
                return _now ? _now : periods[0];
            }
        };

        var findByTurn = function(turn) {
            return load()
                .then(function(periods) {
                    return _.find(periods, function(period) {
                        return period.turn === turn;
                    });
                });
        };

        return {
            next: next,
            findByTurn: findByTurn,
            load: load,
            now: now
        }
    }

})();
