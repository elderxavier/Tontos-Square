(function() {
    'use strict';

    angular
        .module('starter.popup')
        .factory('popupService', popupService);

    popupService.$inject = [
        '$rootScope',
        '$state',
        'ngDialog',
        '$ionicPopup',
        '$ionicHistory'
    ];

    /* @ngInject */
    function popupService(
        $rootScope,
        $state,
        ngDialog,
        $ionicPopup,
        $ionicHistory) {

        var service = {
            open: open,
            openChoice: openChoice,
            openImageChoice: openImageChoice,
            openNeedLoginOrRegister: openNeedLoginOrRegister
        };

        var popup;

        return service;

        function open(titleP, body, state, stateParams) {

            var scope = $rootScope.$new();
            scope.titleP = titleP;
            scope.body = body;
            scope.state = state;
            scope.stateparams = stateParams;
            scope.closePopup = closePopup;

            popup = $ionicPopup.show({
                templateUrl: 'scripts/popup/popup.html',
                cssClass: 'popup-generic',
                scope: scope,
                buttons: [{
                    text: 'Ok!',
                    onTap: function(e) {
                        closePopup(state, stateParams);
                    }
                }]
            })

            // ngDialog.open({
            //  template: 'scripts/popup/popup.html',
            //  className: 'ngdialog-theme-default',
            //  scope: scope
            //  // closeByNavigation: true
            // })
        }

        function openChoice(titleP, body, yesText, yesFunction, noText, state, stateParams, noFunction) {

            var scope = $rootScope.$new();
            scope.titleP = titleP;
            scope.body = body;
            scope.state = state;
            scope.stateparams = stateParams;
            scope.closePopup = closePopup;

            popup = $ionicPopup.show({
                templateUrl: 'scripts/popup/popup.html',
                cssClass: 'popup-generic',
                scope: scope,
                buttons: [{
                    text: yesText,
                    onTap: yesFunction
                }, {
                    text: noText,
                    onTap: function(e) {
                        closePopup(state, stateParams);
                        if (noFunction) noFunction(e);
                    }
                }]
            });

            return popup;
        }

        function openImageChoice(titleP, cameraFunction, pickerFunction) {

            var scope = $rootScope.$new();
            scope.titleP = titleP;
            scope.body = 'Gostaria de tirar uma foto ou escolher uma imagem da galeria?';
            scope.closePopup = closePopup;

            popup = $ionicPopup.show({
                templateUrl: 'scripts/popup/popup.html',
                cssClass: 'popup-generic',
                scope: scope,
                buttons: [{
                    text: 'Câmera',
                    onTap: cameraFunction
                }, {
                    text: 'Galeria',
                    onTap: pickerFunction
                }]
            });

            return popup;
        }

        function openNeedLoginOrRegister(successCallback) {
            var scope = $rootScope.$new();
            scope.titleP = 'Crie seu cadastro.';
            scope.body = 'Por favor, faça o login ou cadastre-se no Ëater.';
            scope.closePopup = closePopup;

            popup = $ionicPopup.show({
                templateUrl: 'scripts/popup/popup.html',
                cssClass: 'popup-generic',
                scope: scope,
                buttons: [{
                    text: 'Login',
                    onTap: function() {
                        $state.go('app.first-interaction', { successCallback: successCallback });
                    }
                }, {
                    text: 'Cadastro',
                    onTap: function() {
                        $state.go('app.register', { successCallback: successCallback });
                    }
                }]
            });

            return popup;
        }

        function closePopup(state, stateParams) {
            if (state) {
                $state.go(state, stateParams)
            }

            popup.close();
            // ngDialog.close();

        }

    }

})();
