(function() {
    'use strict';

    angular
        .module('starter.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$ionicFilterBar', 'searchService', '$scope', '$state', '$timeout'];

    /* @ngInject */
    function SearchController($ionicFilterBar, searchService, $scope, $state, $timeout) {

        var vm = angular.extend(this, {
            showFilterBar: showFilterBar,
            refreshItems: refreshItems,
            goToSeachResults: goToSeachResults,
            items: []
        });

        var filterBarInstance;
        var query;

        showFilterBar();

        function getItems(filterText) {
            var items = [];
            items.push({ text: filterText });
            vm.items = items;
        }

        function showFilterBar() {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.items,
                update: function(filteredItems, filterText) {
                    if (filterText) {
                        query = filterText
                        getItems(filterText);
                    }
                },
                cancelText: 'Cancelar',
                cancel: function() {
                    if (!$state.includes('app.search-results')) {
                        $state.go('app.home');
                    }
                }
            });
        };

        function refreshItems() {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function() {
                getItems(query);
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        function goToSeachResults(query) {
            $state.go('app.search-results', { query: query });
        };
    }

})();
