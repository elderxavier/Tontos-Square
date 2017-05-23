(function() {
    'use strict';

    var app = angular.module('starter.common');
    app.factory('DateClassService', DateClassService);

    DateClassService.$inject = ['moment'];

    function DateClassService (moment) {

        var dateFormat = "YYYY-MM-DD";
        var hourFormat = "HH:mm";

        var today = moment().format(dateFormat);
        var tomorrow = moment().add(1, 'days').format(dateFormat);

		/**
		 * @param options (optional)
		 * @private
		 */
		function _Date(options) {

			if (!options) return;

			var dateToString = (typeof options.from === 'string') ? options.from : (options.from.year+'-'+ (options.from.month+1)+'-'+options.from.day);

			if ((options.from !== "tomorrow") && (options.from !== "today")) {
                this.from = moment(dateToString, dateFormat).format(dateFormat);
			}

            if ((options.from === 'tomorrow' || this.from === tomorrow)){
                this.date = tomorrow;
                this.alias = 'Amanhã';
                this.day = moment(tomorrow, dateFormat).format('dddd');
            } else if ((options.from === 'today' || this.from === today)){
                this.date = today;
                this.alias = 'Hoje';
                this.day = moment(today, dateFormat).format('dddd');
            } else if (options.from) {
                this.date = dateToString;
                this.alias = moment(this.from, dateFormat).format("DD/MM");
                this.day = moment(this.from, dateFormat).format('dddd');
            }
        }

        _Date.prototype.hour = function() {
            return moment().format(hourFormat);
        }

        _Date.prototype.next = function(day) {
            var currentMoment;
            if (moment().isoWeekday() <= day) {
                currentMoment = moment().isoWeekday(day);
            } else {
                currentMoment = moment().add(1, 'weeks').isoWeekday(day);
            }

            this.date = currentMoment.format(dateFormat);
            this.alias = currentMoment.format("DD/MM");
            this.day = currentMoment.format('dddd');
        }

        return _Date;
    }

})();
