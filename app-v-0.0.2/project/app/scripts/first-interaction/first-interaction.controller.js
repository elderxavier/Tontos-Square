(function() {
    'use strict';

    angular
        .module('starter.first-interaction')
        .controller('FirstInteractionController', FirstInteractionController);

    FirstInteractionController.$inject = ['$state', 'firstInteractionService', 'authService', '$ionicModal', '$scope', '$ionicSideMenuDelegate', '$ionicHistory'];

    /* @ngInject */
    function FirstInteractionController($state, firstInteractionService, authService, $ionicModal, $scope, $ionicSideMenuDelegate, $ionicHistory) {

        var vm = angular.extend(this, {
            goToLocation: goToLocation,
            facebookLogin: facebookLogin,
            resetPassword: authService.resetPassword,
            emailLogin: emailLogin,
            logout: authService.logout,
            email: email,
            password: password
        });

        function email() {
            if (window.localStorage.getItem('username'))
                return window.localStorage.getItem('username');
        }

        function password() {
            if (window.localStorage.getItem('password'))
                return window.localStorage.getItem('password');
        }

        $scope.$on('$ionicView.enter', function() {
            $ionicHistory.clearHistory();
            $ionicSideMenuDelegate.canDragContent(false);
        });

        $ionicModal.fromTemplateUrl('scripts/first-interaction/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'

        }).then(function(modal) {
            $scope.modal = modal;

        });

        function goToLocation() {
            $state.go('app.location', {
                productId: 1
            });
        }

        function emailLogin(email, password) {
            authService.emailLogin(email, password, $state.params.successCallback).then(function() {
                if ($state.params.successCallback) {
                    $state.params.successCallback();
                }
            })
        }

        function facebookLogin() {
            authService.facebookLogin($state.params.successCallback).then(function() {
                if ($state.params.successCallback) {
                    $state.params.successCallback();
                }
            })
        }



    }
})();
