(function() {
    'use strict';
    
    var app = angular.module('et-toggle', []);
    
    app.directive('etToggle', [function(){
        
        return {
            restrict: 'E',
            scope: { 
                target: '='
            }, 
            template: "<span class='et-toogle' ng-class='{off: !target.on, on: target.on}' ng-click='toggle()'></span>",
            controller: 'EtToggleController'
        }
        
    }]);
    
    app.controller('EtToggleController', ['$scope', function($scope) {
        
        $scope.toggle = function() {
            $scope.target.on = !$scope.target.on;
        }
    }]);
    
})();