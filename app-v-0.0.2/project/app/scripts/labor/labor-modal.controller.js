(function () {
    'use strict';
    angular
            .module('starter.labor')
            .controller('LaborModalController', LaborModalController);

    LaborModalController.$inject = ['$scope', '$state', 'laborService', 'calendarService', 'periodsService', '_', 'laborModalService', 'restaurantCartService', '$rootScope', '$ionicPopup'];

    function LaborModalController($scope, $state, laborService, calendarService, periodsService, _, laborModalService, restaurantCartService, $rootScope, $ionicPopup) {
        var fresh;

        (function activated() {
            laborService.getSelectedOrCreate().then(function (labor) {
                fresh = _.clone(labor);
                if (fresh.availability) {
                    $scope.setAvailabilityMode(fresh.availability);
                }
            });
        })();

        $scope.close = laborModalService.modal.close;
        $scope.isCheckoutMode = laborModalService.isCheckoutMode;
        $scope.morning = true;
        $scope.afternoon = true;
        $scope.evening = true;

        $scope.setPeriod = function (turn) {
            periodsService.findByTurn(turn).then(function (period) {
                fresh.periods = [period];
            });
        };

        $scope.setAvailabilityMode = function (mode) {
            fresh.availability = mode;
            $scope.availabilityMode = mode;
        };

        var setDate = function (date) {
            fresh.date = date;

            if (laborModalService.isCheckoutMode()) {
                $scope.morning = laborModalService.notWorkingPeriodsShouldBeUnavailable(date, "MORNING");
                $scope.afternoon = laborModalService.notWorkingPeriodsShouldBeUnavailable(date, "AFTERNOON");
                $scope.evening = laborModalService.notWorkingPeriodsShouldBeUnavailable(date, "EVENING");
            }
        };

        $scope.addToCart = function () {
            if (!laborModalService.isCheckoutMode())
                return;

            laborService.change(fresh);

            var plate = laborModalService.getPlate();
            restaurantCartService.addToCart(plate, 1);
            laborModalService.modal.close();
            $state.go('app.restaurant-cart');
        };

        calendarService.desactivePastDates();
        calendarService.on('click', setDate);

        $scope.change = function () {
            if (fresh.availability === 'at-hand' || fresh.availability === 'show-all') {
                laborService.getCurrentPeriod().then(function (labor) {
                    fresh.date = labor.date;
                    fresh.periods = labor.periods;
                    laborService.change(fresh);
                    laborModalService.modal.close();
                });
            } else {
                laborService.change(fresh);
                laborModalService.modal.close();
            }
        };

        $rootScope.toStep = function (step) {
            switch (step) {
                case 1:
                    $rootScope.step1 = true;
                    $rootScope.step2 = false;
                    $rootScope.step3 = false;
                    break;
                case 2:
                    $rootScope.step1 = false;
                    $rootScope.step2 = true;
                    $rootScope.step3 = false;
                    break;
                default:
                    $rootScope.step1 = true;
                    $rootScope.step2 = false;
                    $rootScope.step3 = false;
            }
        };

        //steps
        if (laborModalService.isCheckoutMode()) {
            $rootScope.toStep(2);
        } else {
            $rootScope.toStep(1);
        }
    }
})();
