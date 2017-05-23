(function() {
    'use strict';

    angular
        .module('starter.profile')
        .controller('ProfileController', ProfileController)
        .directive('triggerFocusOn', function($timeout) {
            return {
                link: function(scope, element, attrs) {
                    element.bind('click', function() {
                        $timeout(function() {
                            var otherElement = document.querySelector('#' + attrs.triggerFocusOn);

                            if (otherElement) {
                                otherElement.focus();
                            } else {
                                console.log("Can't find element: " + attrs.triggerFocusOn);
                            }
                        });
                    });
                }
            };
        });
    ProfileController.$inject = [
        '$state',
        'profileService',
        '$scope',
        '$rootScope',
        '$ionicPopup',
        'ngDialog',
        'popupService',
        'imageService',
        'IMAGE',
        '$ionicLoading',
        'moment'];

    /* @ngInject */
    function ProfileController(
        $state,
        profileService,
        $scope,
        $rootScope,
        $ionicPopup,
        ngDialog,
        popupService,
        imageService,
        IMAGE,
        $ionicLoading,
        moment) {

        var birthday = moment($rootScope.currentUser.birthday).toDate();
        //$rootScope.currentUser.birthday = birthday;

        var vm = angular.extend(this, {
            viewName: profileService.getModuleName(),
            displayNameDisabled: true,
            phoneDisabled: true,
            othersDisabled: true,
            buttonDisabled: true,
            setDisplayNameDisabled: setDisplayNameDisabled,
            setPhoneDisabled: setPhoneDisabled,
            goAdressConf: goAdressConf,
            callModalUpdateConfirm: callModalUpdateConfirm,
            updateUserFB: updateUserFB,
            closePopup: closePopup,
            popup: {},
            openModal: openModal
        });

        customValidation();

        function customValidation() {
            //addressCount
            $scope.$watch('vm.user.digestedAddresses.length', function(addressCount) {
                $scope.vm.registerForm.selectedAddresses.$setValidity('addressCount', addressCount > 0);
            }, true);
        }

        vm.user = $rootScope.currentUser;
        vm.user.fullPath = $rootScope.currentUser.photoURL;
        if (vm.user.birthday) {
            vm.user.birthday = moment(vm.user.birthday).format('DD/MM/YYYY');
            vm.birthdayDisabled = true;
        }

        if (vm.user && vm.user.addresses) {
            profileService.getUserAddresses(vm.user.addresses).then(function(addresses) {
                vm.user.digestedAddresses = addresses;
            });
        }

        function closePopup() {
            ngDialog.close();
        }

        function setDisplayNameDisabled() {
            vm.displayNameDisabled = false;
            vm.buttonDisabled = false;

        }

        function setPhoneDisabled() {
            vm.phoneDisabled = false;
            vm.buttonDisabled = false;
        }

        function goAdressConf() {
            $state.go('app.address-confirmation', { goBack: true });
        }

        function callModalUpdateConfirm() {
            // var scope = $rootScope.$new();
            vm.popup = popupService.openChoice(
                'Alterar os dados',
                'Tem certeza que deseja alterar os dados?',
                'Sim',
                function(e){
                    vm.updateUserFB(vm.user);
                },
                'Não'
            );
            // ngDialog.open({
            //     template: 'scripts/profile/popup/popup.html',
            //     scope: $scope,
            //     className: 'ngdialog-theme-default'
            // });
            /*var confirmPopup = $ionicPopup.confirm({
                title: '<p>Alterar os dados</p>',
                scope: scope,
                template: '<p>Tem certeza que deseja alterar os dados?</p>',
                cssClass: 'popup',
                buttons: [{
                    text: "Não",
                }, {
                    text: "Sim",
                    onTap: function(e) {
                        updateUserFB(vm.user);
                    }
                }]
            });*/
        }


        function updateUserFB(user) {
            vm.popup.close();
            $ionicLoading.show();
            user.birthday = moment(vm.user.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
            console.log(user);
            profileService.setUser(user).then(function (data) {
                $rootScope.currentUser = vm.user;
                $ionicLoading.hide();
                $state.go('app.home');
            });
        }

        /**
         * Esta função determina qual será o método de chamada de escolha da imagem de perfil
         * 
         * @param {int} option
         */
        function getImage(option){
            if( option === 0 ){
                // vm.user.fullPath = '/images/icon-camera-128.png';
                // vm.user.filename = 'icon-camera-128';
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
            vm.popup.titleP ='Sua foto' ;

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
