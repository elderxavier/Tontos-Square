(function() {
    'use strict';

    angular
        .module('starter.validation', [
            'ionic',
            'ngCordova',
            'starter.common'
        ]).run(['$rootScope', 'validationService', function($rootScope, validationService) {
        	// dispose validateForm method on $rootScope
            $rootScope.validateForm = validationService.validateForm;
        }]);
})();
