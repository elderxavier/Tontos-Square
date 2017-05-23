(function() {
    'use strict';

    angular
        .module('starter.validation')
        .factory('validationService', validationService);

    validationService.$inject = [
        '$ionicPopup',
        '$http',
        '$rootScope',
        'ngDialog',
        '$ionicModal',
        '$cordovaDialogs'
    ];

    /* @ngInject */
    function validationService(
        $ionicPopup,
        $http,
        $rootScope,
        ngDialog,
        $ionicModal,
        $cordovaDialogs) {

        var service = {
            validateForm: validateForm,
            validationObject: {},
            validationObjectDefault: {},
            closePopup: closePopup
        };

        loadValidationJSON();

        return service;

        function closePopup() {
            $scope.popup.close();
        }

        function loadValidationJSON() {
            $http.get('scripts/validation/validation.json').then(function(validationObject) {
                service.validationObject = validationObject;
            }).catch(function(error) {
                console.log(error);
            });

            $http.get('scripts/validation/validation-default.json').then(function(validationObjectDefault) {
                service.validationObjectDefault = validationObjectDefault;
            }).catch(function(error) {
                console.log(error);
            });
        }

        function validateForm(form, viewName) {
            var $scope = $rootScope.$new();
            $scope.errors = [];
            var valid = true;

            if (service.validationObject && !form.$valid) {
                valid = false;

                for (var key in form.$error) {
                    for (var index = 0; index < form.$error[key].length; index++) {
                        var reason = getReason(form.$error[key][index].$name, viewName, key);
                        if (reason) {
                            $scope.errors.push(reason);
                        }
                    }
                }
                //If no errors messeges defined for error
                if ($scope.errors.length === 0) {
                    $scope.errors.push("Por favor verifique os dados.");
                }

                // $ionicModal.fromTemplateUrl('scripts/validation/popup/popup.html', {
                //     scope: $scope,
                //     animation: 'slide-in-up',
                //     focusFirstInput: true
                // }).then(function (modal) {
                //     $scope.modal = modal;
                //     $scope.modal.show();
                // }); 

                // var dialog = ngDialog.open({
                //     template: 'scripts/validation/popup/popup.html',
                //     scope: $scope,
                //     className: 'ngdialog-theme-default validation'
                // });

                $scope.popup = $ionicPopup.show({
                    templateUrl: 'scripts/validation/popup/popup.html',
                    cssClass: 'popup-validation',
                    scope: $scope,
                    buttons: [{
                        text: 'Ok',
                        onTap: function(e) {
                            $scope.popup.close();
                            $scope.$destroy();
                        }
                    }]
                })

                $scope.closePopup = function() {
                    $scope.popup.close();
                }
            }

            // $scope.closePopup = function () {
            // 	$scope.popup.close();
            // 	$scope.$destroy();
            // };

            return valid;
        }

        function getReason(errorField, viewName, errorType) {
            var reason = null;
            try {
                reason = service.validationObject[viewName][errorType][errorField];
            } catch (error) {}
            //if not found in validation.json find in validation-default.json
            if (!reason) {
                reason = service.validationObjectDefault[errorField];
            }
            return reason;
        }
    }
})();
