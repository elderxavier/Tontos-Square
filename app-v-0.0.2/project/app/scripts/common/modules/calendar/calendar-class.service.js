(function() {
    'use strict';

    angular
        .module('calendar')
        .factory('CalendarClassService', CalendarClassService);

    CalendarClassService.$inject = ['moment', '_'];

    function CalendarClassService (moment, _) {

		moment.locale('pt-br');

		function Calendar () {

            var daysToShow;
            var referredMoment;
            var rules = [];

            function addRule(rule) {
            	if (rules.indexOf(rule) === -1) {
					rules.push(rule);
				}
            }

            function removeRule(rule) {
                var index = rules.indexOf(rule);
                rules.splice(index, 1);
            }

			function shouldRepectAllRules(date) {
				return function (rule) { return rule(date); }
			}

            function isAvailable(date) {
            	return rules.every(shouldRepectAllRules(date));
            }

            function setMoment(arg) {
                if (arg && arg > 0)
                    return moment().clone().add(arg, 'months');
                else if (arg && arg < 0)
                    return moment().clone().subtract(Math.abs(arg), 'months');
                else
                    return moment().clone();
            }

            function setupPrimeExtraDays() {
                var a = referredMoment.clone().subtract(1, 'months').daysInMonth();
                var b = a - referredMoment.clone().date(1).day() + 1;

                for (var i = b, extraDays = []; i <= a; i++) {
                    var calendarDate = {
                        day: i,
                        month: referredMoment.clone().subtract(1, 'months').month(),
                        year: referredMoment.year()
                    }

                    var available = isAvailable(calendarDate);
                    calendarDate.available = available;

                    extraDays.push(calendarDate);
                }

                daysToShow = extraDays.concat(daysToShow);
            }

            function setupEndExtraDays() {
                var a = referredMoment.daysInMonth();
                var b = 6 - referredMoment.clone().date(a).day();

                for (var i = 1, extraDays = []; i <= b; i++) {
                    var calendarDate = {
                        day: i,
                        month: referredMoment.clone().add(1, 'months').month(),
                        year: referredMoment.year()
                    }

                    var available = isAvailable(calendarDate);
                    calendarDate.available = available;

                    extraDays.push(calendarDate);
                }

                daysToShow = daysToShow.concat(extraDays);
            }

            function init(int) {
                referredMoment = setMoment(int);
				setupDays();
            }

            function setupDays() {
				daysToShow = [];

				for (var i = 1; i <= referredMoment.daysInMonth(); i++) {
					var calendarDate = {
						day: i,
						month: referredMoment.month(),
						year: referredMoment.year()
					}

					var available = isAvailable(calendarDate);
					calendarDate.available = available;

					daysToShow.push(calendarDate);
				}

				setupPrimeExtraDays();
				setupEndExtraDays();
			}

            function rows() {
                var _rows = [];
                var chunk = 7;
                for (var i = 0; i < daysToShow.length; i += chunk) {
                    _rows.push(daysToShow.slice(i, i + chunk));
                }
                return _rows;
            }

            function year() {
            	return referredMoment.format('YYYY');
			}

            function month() {
                return referredMoment.format('MMMM');
            }

            function monthNumber() {
                return referredMoment.month();
            }

            function isPast(date) {
                var dateString = moment(date.year+'-'+(date.month+1)+'-'+date.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
                var now = moment().format('YYYY-MM-DD');

                var result = moment(now).isAfter(dateString, 'day');
                return result;
            }

            function offsetMonth(toAdd) {
            	return function() {
					referredMoment = referredMoment.clone().add(toAdd, 'month');
					setupDays();
				};
			}

            return {
                init: init,
                rows: rows,
                month: month,
				year: year,
                monthNumber: monthNumber,
                isPast: isPast,
                addRule: addRule,
                removeRule: removeRule,
				nextMonth: offsetMonth(1),
				previousMonth: offsetMonth(-1),
            }
        }

        return Calendar;
    }
})();
