(function() {
    'use strict';

    angular
        .module('starter.register')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'chefsService',
        '$location',
        'authService',
        '$ionicModal',
        'locationService',
        'registerService',
        '$rootScope',
        'ngDialog',
        'imageService',
        'popupService',
        'IMAGE'
    ];

    /* @ngInject */
    function RegisterController(
        $scope,
        $state,
        $stateParams,
        chefsService,
        $location,
        authService,
        $ionicModal,
        locationService,
        registerService,
        $rootScope,
        ngDialog,
        imageService,
        popupService,
        IMAGE) {
        var vm = angular.extend(this, {
            openPopup: openPopup,
            openModal: openModal,
            chefId: $stateParams.chefId,
            chef: null,
            closeModal: closeModal,
            emailCheck: emailCheck,
            submitForm: submitForm,
            submitFormUser: submitFormUser,
            submitFormChefToUser: submitFormChefToUser,
            popup: {},
            user: {
                fullPath: 'images/icon-camera-128.png',
                filename: 'icon-camera-128',
                getImage: getImage
            },
            terms: false
        });

        init();

        function getChefById(chefId) {
            chefsService.getChefById(chefId).then(function(chef) {
                vm.chef = chef;
                vm.user.fullPath = chef.thumb;
                vm.user.photoURL = chef.thumb;
                vm.user.email = chef.email;
                vm.user.displayName = chef.name;
                vm.user.phone = chef.phone;
                vm.user.cpf = chef.cpf;
                vm.user.birthday = chef.birthday;

            }).catch(function(error) {
                console.log(error);
            });
        }

        function openPopup(option) {
            ngDialog.open({
                template: option === 0 ? 'scripts/register/popup/termsOfUse.html' : 'scripts/register/popup/privacyPolicy.html',
                scope: $scope,
                className: 'ngdialog-theme-default register-popup'
            });
        }

        function closeModal() {
            ngDialog.close();
        }

        function emailCheck() {
            if (vm.chefId == null) {
                registerService.emailCheck(vm.user.email);
            }
            return 'opa';
        }

        function init() {
            if (vm.chefId != null) {
                getChefById(vm.chefId);
            }
        }

        function submitForm(form) {
            if (vm.chefId != null) {
                vm.submitFormChefToUser(form);
            } else {
                vm.submitFormUser(form);
            }

            if ($state.params.successCallback) {
                $state.params.successCallback();
            }
        }

        function submitFormUser(form) {

            $scope.options = {
                hideBackButton: true
            };

            locationService.hideBackButton();

            if (form.$valid) {
                $rootScope.$broadcast('loading:show');
                authService.registerUser(vm.user, $state.params.successCallback).then(function(user) {
                    imageService.uploadImage(vm.user.filename, vm.user.fullPath, user.$id).then(function(returno) {
                        //$location.path('app/location');
                    }).catch(function(error) {
                        console.log(error);
                    });
                }).catch(function(error) {
                    console.log(error);
                }).then(function() {
                    $rootScope.$broadcast('loading:hide');
                });
            }
        }

        function submitFormChefToUser(form) {

            $scope.options = {
                hideBackButton: true
            };

            locationService.hideBackButton();

            if (form.$valid) {
                $rootScope.$broadcast('loading:show');
                authService.registerChefToUser(vm.user).then(function(user) {
                    console.log('criado');
                }).catch(function(error) {
                    console.log(error);
                }).then(function() {
                    $rootScope.$broadcast('loading:hide');
                });
            }
        }

        /**
         * Esta função determina qual será o método de chamada de escolha da imagem de perfil
         * 
         * @param {int} option
         */
        function getImage(option) {
            if (option === 0) {
                imageService.getImage(IMAGE.CAMERA).then(function(data) {
                    vm.user.fullPath = data.fullPath;
                    vm.user.filename = data.filename;
                    vm.popup.window.close();
                });
            } else {
                imageService.getImage(IMAGE.GALLERY).then(function(data) {
                    vm.user.fullPath = data.fullPath;
                    vm.user.filename = data.filename;
                    vm.popup.window.close();
                });
            }
        }

        // Chama Popup para escolha entre a câmera e a galeria
        function openModal() {
            vm.popup.titleP = 'Sua foto';

            vm.popup.window = popupService.openImageChoice(
                vm.popup.titleP,
                function(e) {
                    getImage(0);
                },
                function(e) {
                    getImage(1);
                }
            );

        }

    }
})();
