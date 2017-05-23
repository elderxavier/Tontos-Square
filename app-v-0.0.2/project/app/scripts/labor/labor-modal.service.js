(function () {
    'use strict';

    var app = angular.module('starter.labor');
    app.factory('laborModalService', laborModalService);

    laborModalService.$inject = ['ModalScaffoldService', 'calendarService', 'laborService', 'DateClassService', 'LaborClassService'];

    function laborModalService (ModalScaffoldService, calendarService, laborService, DateClassService, LaborClassService) {

        var modal = new ModalScaffoldService('labor', {class: 'eater-dialog-home', overlay: false });
        var aim = { checkout: false, plate: false };

        var notWorkingDateShouldBeUnavailable = function (date) {
            var laborDate = new DateClassService({from: date});
            var labor = new LaborClassService(laborDate);
            return labor.matchDayWithAny(aim.checkout.plate.chef.labors);
        };

        var notWorkingPeriodsShouldBeUnavailable = function (date, turn) {
            var labor = new LaborClassService(date, [turn]);
            return labor.matchWithAnyForPeriodModal(aim.checkout.plate.chef.labors);
        };

        var setCheckoutMode = function (plate) {
            if(aim.checkout) return;
            aim.checkout = {plate: plate}
            calendarService.addRule(notWorkingDateShouldBeUnavailable);
        };

        var setFilterMode = function () {
            if(!aim.checkout) return;
            aim.checkout = false;
            calendarService.removeRule(notWorkingDateShouldBeUnavailable);
        };

        var isCheckoutMode = function() {
            return aim.checkout ? true : false;
        };

        var getPlate = function() {
            if(aim.checkout) return aim.checkout.plate;
        };

        return {
            modal: modal,
            isCheckoutMode: isCheckoutMode,
            setFilterMode: setFilterMode,
            setCheckoutMode: setCheckoutMode,
            getPlate: getPlate,
            notWorkingPeriodsShouldBeUnavailable: notWorkingPeriodsShouldBeUnavailable
        };
    }

})();
