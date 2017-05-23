(function() {
    'use strict';

    angular
        .module('starter.sale-flow')
        .controller('DeliveryController', DeliveryController);

    DeliveryController.$inject = ['$scope', '$state', '$rootScope', 'ordersService', 'deliveryMethod'];

    /* @ngInject */
    function DeliveryController($scope, $state, $rootScope, ordersService, deliveryMethod) {
        var vm = angular.extend(this, {
        });
        
        $scope.proceed = function(isWithDraw) {
            ordersService.currentOrder.deliveryMethod = isWithDraw ? deliveryMethod.WITHDRAW : deliveryMethod.DELIVERY; 
            isWithDraw ? $state.go('app.sale-flow-personal-info') : $state.go('app.sale-flow-address-selection');
        }
    }
})();
