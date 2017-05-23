(function () {
    'use strict';

    angular
        .module('starter.chefdetail')
        .controller('ChefDetailController', ChefDetailController);

    ChefDetailController.$inject = ['$stateParams', '$state', '$scope', 'chefsService', 'plateService', 'restaurantCartService', 'ionicToast', 'laborModalService', 'labor', 'dataService', 'homePlatesService'];

    /* @ngInject */
    function ChefDetailController($stateParams, $state, $scope, chefsService, plateService, restaurantCartService, ionicToast, laborModalService, labor, dataService, homePlatesService) {

        var vm = angular.extend(this, {
            showPlateDetails: homePlatesService.showPlateDetails,
            quickAddToCart: quickAddToCart,
            showCart: showCart,
            chefId: $stateParams.chefId,
            goLabor: goLabor,
            setCheckoutMode: setCheckoutMode,
            isAtHand: isAtHand,
            isItemShown: isItemShown,
            shownItem: null,
            toggleItem: toggleItem
        });
        function toggleItem() {
            if (vm.isItemShown()) {
                vm.shownItem = null;
            } else {
                vm.shownItem = 'open';
            };
        }

        function isItemShown() {
            return vm.shownItem === 'open';
        };
        function isAtHand(plate) {
            return labor.matchWithAny(plate.chef.labors);
        }

        function goLabor() {
            laborModalService.modal.open();
        }

        function setCheckoutMode(plate) {
            laborModalService.setCheckoutMode(plate);
        }

        chefsService.getChefById(vm.chefId).then(function (chef) {
            $scope.chefThumb = chef.thumb;
            $scope.chefName = chef.name;
            $scope.chefSpec = chef.speciallity;
            $scope.chefAbout = chef.about;
            $scope.chefRating = chef.rating;
            $scope.workingPeriods = getFormattedWorkingPeriods(chef.working_periods);
        });

        plateService.getChefActivePlates(vm.chefId)
            .then(dataService.populate('chef', { nodeName: 'chefs' }))
            .then(chefsService.populateLabors)
            .then(function (plates) {
                $scope.plates = plates;
            });

        $scope.plateRatingInteger = function (ratingNumber) {
            if (ratingNumber) {
                return new Array(ratingNumber | 0);
            }
            return new Array(0);
        };

        function quickAddToCart(plate) {
            restaurantCartService.addToCart(plate, 1);
            $state.go('app.restaurant-cart');
        }

        function getFormattedWorkingPeriods(workingPeriods) {
            var formattedWorkingPeriods = [];

            if (workingPeriods.sunday) {
                formattedWorkingPeriods.push('Domingo: ' + getFormattedPeriods(workingPeriods.sunday.periods));
            }
            if (workingPeriods.monday) {
                formattedWorkingPeriods.push('Segunda: ' + getFormattedPeriods(workingPeriods.monday.periods));
            }
            if (workingPeriods.tuesday) {
                formattedWorkingPeriods.push('Terça: ' + getFormattedPeriods(workingPeriods.tuesday.periods));
            }
            if (workingPeriods.wednesday) {
                formattedWorkingPeriods.push('Quarta: ' + getFormattedPeriods(workingPeriods.wednesday.periods));
            }
            if (workingPeriods.thursday) {
                formattedWorkingPeriods.push('Quinta: ' + getFormattedPeriods(workingPeriods.thursday.periods));
            }
            if (workingPeriods.friday) {
                formattedWorkingPeriods.push('Sexta: ' + getFormattedPeriods(workingPeriods.friday.periods));
            }
            if (workingPeriods.saturday) {
                formattedWorkingPeriods.push('Sabado: ' + getFormattedPeriods(workingPeriods.saturday.periods));
            }

            return formattedWorkingPeriods;
        }

        function getFormattedPeriods(periods) {
            console.log(periods);
            var formattedPeriods = '';
            var array = [];

            if (periods['-KOq7EQrtrFog8yrsDls']) {
                //formattedPeriods += 'Manhã, ';
                array.push('Manhã');
            }
            if (periods['-KOq7K0sS_hfZZJpTW4P']) {
                //formattedPeriods += 'Tarde, ';
                array.push('Tarde');
            }
            if (periods['-KOq7O_Me1B99OOKW_Kv']) {
                //formattedPeriods += 'Noite, ';
                array.push('Noite');
            }

            // adiciona virgulas
            formattedPeriods = array.join(', ');

            // adiciona 'e'
            formattedPeriods = formattedPeriods.replace(/, ([^, ]*)$/, ' e ' + '$1');

            return formattedPeriods;

        }

        function showCart() {
            $state.go('app.restaurant-cart');
        }
    }
})();
