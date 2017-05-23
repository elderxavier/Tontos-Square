(function () {
    'use strict';
    angular
        .module('calendar')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = ['$scope', 'calendarService', 'DateClassService', '$rootScope'];

    function CalendarController($scope, calendarService, DateClassService, $rootScope) {
        calendarService.init();
        var selectedDate;

        var init = function () {
            $scope.rows = calendarService.rows();
            $scope.month = calendarService.month();
            $scope.year = calendarService.year();
        }

        init();

        $scope.next = function () {
            calendarService.next();
            init();
        }

        $scope.previous = function () {
            calendarService.previous();
            init();
        }

        $scope.onClick = function(element) {
            selectedDate = element.year+'-'+element.month+'-'+element.day;

            var date = new DateClassService({from: element});
            calendarService.emit("click", [date]);
        }

        $scope.isSelected = function(element) {
            return selectedDate === element.year+'-'+element.month+'-'+element.day;
        }
        
        $scope.toStep3 = function(){
            $rootScope.step1 = false;
            $rootScope.step2 = false;
            $rootScope.step3 = true;
        }
    }
})();
