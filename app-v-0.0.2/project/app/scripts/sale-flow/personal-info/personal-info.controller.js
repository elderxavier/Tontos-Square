(function() {
    'use strict';

    var app = angular.module('starter.sale-flow');
    app.controller('PersonalInfoController', PersonalInfoController);

    PersonalInfoController.$inject = ['$rootScope', '$scope', '$state', 'userService', 'iuguService'];

    function PersonalInfoController($rootScope, $scope, $state, userService, iuguService) {

        var user = $rootScope.currentUser;

        $scope.personalInfo = user ? {
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            phone: user.phone
        } : {};

        $scope.proceed = function() {
            var userPhone = user.phone ? user.phone.toString() : undefined;
            var typedPhone = $scope.personalInfo.phone ? $scope.personalInfo.phone.toString() : undefined;

            if (!user.cpf) {
                user.cpf = $scope.personalInfo.cpf;
                userService.update(user, 'cpf');
            }


            if ((userPhone && typedPhone && userPhone !== typedPhone) ||
                (!userPhone && typedPhone)) {
                user.phone = $scope.personalInfo.phone;
                userService.update(user, 'phone');
            }


            if (!user.iuguCustomerId) {
                iuguService.createCustomer().then(function(customer) {
                    gotoPayment();
                })
            } else {
                gotoPayment();
            }
        }

        function gotoPayment() {
            $state.go('app.sale-flow-payment', { "paymentMethodName": $scope.personalInfo.name });
        }
    }

})();
