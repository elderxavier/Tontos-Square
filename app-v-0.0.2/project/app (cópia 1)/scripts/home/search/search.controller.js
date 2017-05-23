(function() {
    'use strict';
    
    var app = angular.module('starter.home.search');
    app.controller('HomeSearchController', HomeSearchController);
    
    HomeSearchController.$inject = ['$scope', 'homeSearchService', '$state'];
    
    function HomeSearchController ($scope, homeSearchService, $state) {
        $scope.search = {};
        
        $scope.quest = function (string) {
            homeSearchService.emit('quest', [string]);
        }
        
        homeSearchService.on('clear', function() {
            $scope.search.questString = '';
        });

          $scope.goToSearch = function () {
            $state.go('app.search');
        }
    }
    
})();