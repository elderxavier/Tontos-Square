(function () {
    'use strict';

    angular
            .module('starter.search')
            .controller('SearchResultsController', SearchResultsController);

    SearchResultsController.$inject = ['searchService', '$scope', '$state', 'plateService', 'laborModalService', 'filterService', 'homeService', '$ionicLoading'];

    /* @ngInject */
    function SearchResultsController(searchService, $scope, $state, plateService, laborModalService, filterService, homeService, $ionicLoading) {
        $scope.query = $state.params.query;
        $scope.itens = [];

        $scope.search = function () {
            var query = $scope.query.toLowerCase();
            if (query.trim() == '') {
                return;
            }
            plateService.fromCategory0All().then(function (data) {
                $ionicLoading.hide();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.toLowerCase().search(query) >= 0 || data[i].description.toLowerCase().search(query) >= 0 || data[i].ingredients.toLowerCase().search(query) >= 0) {
                        $scope.itens.push(data[i]);
                    }
                }
            });
        };
        $scope.goLaborFunction = function () {
            laborModalService.isCheckoutMode();
            laborModalService.modal.toggle();
        };

        $scope.openFilter = function () {
            filterService.open($scope);
        };

        $scope.showCart = function () {
            $state.go('app.restaurant-cart');
        };

        $scope.goHome = function () {
            $state.go('app.home');
        };
        $scope.$on('$ionicView.beforeEnter', function (event) {
            $ionicLoading.show();
            $scope.search();
            laborModalService.isCheckoutMode();
            event.preventDefault();
        });

    }

})();
