(function() {
    'use strict';
    angular
        .module('starter.address-confirmation')
        .controller('AddressConfirmationController', AddressConfirmationController);

    AddressConfirmationController.$inject = ['$ionicHistory', '$stateParams', '$scope', 'addressConfirmationService', 'ionicToast', '$state', '$rootScope', 'userAddresses', '$ionicModal'];

    function AddressConfirmationController($ionicHistory, $stateParams, $scope, addressConfirmationService, ionicToast, $state, $rootScope, userAddresses, $ionicModal) {
        var vm = angular.extend(this, {
            addresses: userAddresses,
            confirmCurrentAddress: confirmCurrentAddress,
            showNewAddressModal: showNewAddressModal,
            deleteAddress: deleteAddress,
            goBack: $stateParams.goBack
        });

        loadModal();

        function deleteAddress(addressId) {
            return addressConfirmationService.deleteAddress(addressId).then(function(result) {
                ionicToast.show('Endereço deletado.', 'middle', false, 2000);
                $state.reload();
            });
        }

        function confirmCurrentAddress() {
            addressConfirmationService.confirmCurrentAddress().then(function(result) {
                ionicToast.show('Endereço confirmado.', 'middle', false, 2000);
                if(vm.goBack){
                    $ionicHistory.goBack();
                }
                else{
                    $state.go('app.home');
                }
            });
        }

        function loadModal() {
            $ionicModal.fromTemplateUrl('scripts/address-confirmation/add-address/add-address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
                .then(function(modal) {
                    $scope.modal = modal;
                });
        }

        function showNewAddressModal() {
            $scope.modal.show();
        }
    }
})();
