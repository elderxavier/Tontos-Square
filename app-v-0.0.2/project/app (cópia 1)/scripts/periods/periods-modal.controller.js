(function() {
    'use strict';

    var app = angular.module('starter.periods');
    app.controller('PeriodsModalController', PeriodsModalController);

    PeriodsModalController.$inject = ['$rootScope', '$scope', '$state', 'periodsModalService', 'periodsService', 'laborService', 'restaurantCartService', '_', 'ordersService', 'timeService', 'popupService', '$ionicHistory', 'LaborClassService'];

    function PeriodsModalController($rootScope, $scope, $state, periodsModalService, periodsService, laborService, restaurantCartService, _, ordersService, timeService, popupService, $ionicHistory, LaborClassService) {

        (function OnInit() {
            periodsService.load().then(function(periods) {
                $scope.periods = periods;
            });

            laborService.getSelectedOrCreate().then(function(labor) {
                $scope.setLabor(labor);
            });

            timeService.getNow().then(function(now) {
                $scope.now = now;
            })
        })();

        $scope.setPeriod = function(turn) {
            if (!$scope.selectedLabor) return;

            periodsService.findByTurn(turn).then(function(period) {
                $scope.selectedLabor.periods[0] = period;
                if ($scope.selectedLabor.matchWithAny(restaurantCartService.getChef().labors)) {
                    $scope.availablePeriod = $scope.selectedLabor.periods[0];
                    return $scope.selectedPeriod = $scope.availablePeriod;
                }
                $scope.availablePeriod = undefined;
                $scope.selectedPeriod = period;
            });
        };

        $scope.setLabor = function(labor) {
            if (restaurantCartService.getChef() && labor.matchWithAny(restaurantCartService.getChef().labors)) {
                $scope.selectedLabor = labor;
                $scope.availablePeriod = $scope.selectedLabor.periods[0];
                $scope.selectedPeriod = $scope.availablePeriod;
            }
        };

        $scope.proceed = function(hour) {
            var h = hour.split(":")[0];

            ordersService.currentOrder.total = restaurantCartService.getTotal();
            ordersService.currentOrder.delivery_time = moment().hour(h).minute("00").unix();
            $scope.hide();

            if ($rootScope.currentUser && $rootScope.currentUser.name) {
                goToSaleFLow();
            } else {
                popupService.openNeedLoginOrRegister(goToSaleFLow);
            }
        };

        $scope.canDeliveryInTime = function(time, availablePeriod) {
            if ($scope.now) {
                var plates = restaurantCartService.getAll();
                var maxTimeToPrepare = getMaxTimeToPrepare(plates);
                var avaliableTime = moment($scope.now).add(maxTimeToPrepare.hours, 'hours').add(maxTimeToPrepare.minutes, 'minutes');
                var hour = time.split(':')[0];
                var minutes = time.split(':')[1];
                var year = $scope.selectedLabor
                var period = moment($scope.selectedLabor.date.from).set('hour', hour).set('minute', minutes);
                return period.isAfter(avaliableTime);
            } else {
                return true;
            }
        };

        function goToSaleFLow() {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go('app.home', {}, { location: 'replace' }).then(function() {
                $state.go('app.restaurant-cart', {}, { location: 'replace' }).then(function() {
                    $state.go('app.sale-flow-delivery');
                });
            });
        }

        function getMaxTimeToPrepare(plates) {
            var maxTimeToPrepare = { hours: 0, minutes: 0 };
            plates.forEach(function(plate) {
                var timeToPrepare = { minutes: plate.minutes, hours: plate.hours };
                if (isGreaterThen(timeToPrepare, maxTimeToPrepare)) {
                    maxTimeToPrepare = timeToPrepare;
                }
            });

            return maxTimeToPrepare;
        }

        function isGreaterThen(timeToPrepare1, timeToPrepare2) {
            var minutesToPrepare1 = timeToPrepare1.minutes + timeToPrepare1.hours * 60;
            var minutesToPrepare2 = timeToPrepare2.minutes + timeToPrepare2.hours * 60;

            return minutesToPrepare1 >= minutesToPrepare2;;
        }

        $scope.hide = periodsModalService.hide;
    }
})();
