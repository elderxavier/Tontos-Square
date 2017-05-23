(function () {
    'use strict';

    var app = angular.module('calendar', ['starter.common']);

    app.directive('calendar', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'scripts/common/modules/calendar/calendar.html',
            scope: {}
        };
    });
})();
