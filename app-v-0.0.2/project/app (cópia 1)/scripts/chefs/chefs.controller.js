(function () {
    'use strict';

    angular
        .module('starter.chefs')
        .controller('ChefsController', ChefsController);

    ChefsController.$inject = ['$scope', 'chefsService', 'homePlatesService', 'verticalScrollService', '$state', 'homeSearchService', '$ionicLoading'];

    /* @ngInject */
    function ChefsController($scope, chefsService, homePlatesService, verticalScrollService, $state, homeSearchService, $ionicLoading) {

        var fetch = function() {
            chefsService.getFeaturedChefs().then(function (chefs) {
                $scope.featuredChefs = chefs;
            });

            chefsService.getOnlineChefs().then(function (chefs) {
                $scope.chefs = chefs;
            });
        }

        fetch();

        $scope.showPlateDetails = homePlatesService.showPlateDetails;

        $scope.showChefDetails = function (chef) {
            $state.go('app.chefdetail', {
                chefId: chef.$id
            });
        };

        this.showCart = function () {
            $state.go('app.restaurant-cart');
        };

        homeSearchService.on('quest', function (questedString) {
            if(!questedString ||  questedString === ' ') return fetch();

            $ionicLoading.show();

            chefsService.getChefs()
                .then(function (chefs) {
                    $scope.chefs = _.filter(chefs, function (chef) {
                        return chef.name.toLocaleLowerCase().indexOf(questedString.toLowerCase()) !== -1;
                    });
                })
                .then(chefsService.getFeaturedChefs)
                .then(function (chefs) {
                    $ionicLoading.hide();
                    $scope.featuredChef = _.filter(chefs, function (chef) {
                        return chef.name.toLocaleLowerCase().indexOf(questedString.toLowerCase()) !== -1;
                    });
                });
        });

        homeSearchService.on('clear', function() {
            fetch();
        });

        verticalScrollService.add('chef-carousel');
    }
})();
