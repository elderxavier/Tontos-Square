(function() {
    'use strict';

    angular
        .module('starter.sale-flow')
        .controller('AddressSelectionController', AddressSelectionController);

    AddressSelectionController.$inject = ['$rootScope', 'firebaseDataService', '$scope', 'userAddresses', '$state', 'loggiService', '$ionicModal', 'addressConfirmationService', 'ionicToast', '$ionicLoading', 'ordersService', 'locationService', 'deliveryMethod'];

    /* @ngInject */
    function AddressSelectionController($rootScope, firebaseDataService, $scope, userAddresses, $state, loggiService, $ionicModal, addressConfirmationService, ionicToast, $ionicLoading, ordersService, locationService, deliveryMethod) {
        var vm = angular.extend(this, {});


        function init() {
            $scope.isInRange = null;
            $scope.isEaterDelivery = null;

            $scope.shippingPrice = null;
            $scope.eaterShippingPrice = null;
            $scope.chefShippingPrice = null;

            $scope.setIsEaterDelivery = setIsEaterDelivery;
            $scope.showNewAddressModal = showNewAddressModal;
            $scope.deleteAddress = deleteAddress;
            $scope.set = set;
            $scope.proceed = proceed;
            $scope.data = {};
            $scope.isSelected = isSelected;

            angular.forEach(userAddresses, function(address) {
                if (address.guid === $rootScope.currentUser.currentAddress)
                    return $scope.set(address);
            });

            $scope.userAddresses = userAddresses;
            loadModal();
        }

        init();

        function loadModal() {
            $ionicModal.fromTemplateUrl('scripts/address-confirmation/add-address/add-address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
                .then(function(modal) {
                    $scope.modal = modal;
                });
        }

        function setIsEaterDelivery(isEaterDelivery) {
            $scope.isEaterDelivery = isEaterDelivery;
            ordersService.currentOrder.deliveryMethod = isEaterDelivery ? deliveryMethod.DELIVERY_BY_EATER : deliveryMethod.DELIVERY_BY_CHEF;
            // if (ordersService.currentOrder.address) {
            //     $scope.set(ordersService.currentOrder.address);
            // }

            if ($scope.isEaterDelivery) {
                $scope.shippingPrice = $scope.eaterShippingPrice;

            } else {
                $scope.shippingPrice = $scope.chefShippingPrice;
            }
        }

        function showNewAddressModal() {
            $scope.modal.show();
        };

        function deleteAddress(addressId) {
            return addressConfirmationService.deleteAddress(addressId).then(function(result) {
                ionicToast.show('Endereço deletado.', 'middle', false, 2000);
                $state.go($state.current, {}, { reload: true });
            });
        };

        function isSelected(address) {
            return $scope.selectedAddress === address;
        }

        function set(address) {
            $scope.isEaterDelivery = null;
            $scope.selectedAddress = address;
            ordersService.currentOrder.address = address;
            ordersService.currentOrder.user = $rootScope.currentUser;

            getLoggiShipping();
            getChefShipping();
        };

        function getLoggiShipping() {
            loggiService.estimative(ordersService.currentOrder.chef.currentAddress, $scope.selectedAddress.guid).then(function(price) {
                $scope.eaterShippingPrice = price;
            }).catch(function(error) {
                console.log(error);
                $scope.eaterShippingPrice = null;
                $ionicLoading.hide();
            });
        }

        function getChefShipping() {

            var cost;

            return firebaseDataService.getSettings().$loaded()
                .then(function(settings) {
                    cost = settings.deliveryCost || 1.5;
                    return addressConfirmationService.getAddressById(ordersService.currentOrder.chef.currentAddress);
                })
                .then(function(chefAddress) {
                    return locationService.getDistanceBetweenAddresses(chefAddress, $scope.selectedAddress);
                })
                .then(function(distance) {
                    $scope.distance = distance;
                    //free
                    if (ordersService.currentOrder.chef.freeDelivery || ordersService.currentOrder.chef.freeDeliveryRadius >= $scope.distance) {
                        $scope.chefShippingPrice = 0.00;
                        //paid
                    } else {
                        if (ordersService.currentOrder.chef.paidDeliveryRadius >= $scope.distance) {
                            $scope.isInRange = true;
                            $scope.chefShippingPrice = parseFloat((distance / 1000) * cost).toFixed(2);
                        } else {
                            $scope.isInRange = false;
                            $scope.chefShippingPrice = null;
                        }
                    }
                }).catch(function(error) {
                    console.log(error);
                    $scope.isInRange = false;
                    $scope.chefShippingPrice = null;
                });
        }

        function proceed(addressIndex) {
            ordersService.currentOrder.total = parseFloat(ordersService.currentOrder.total) + parseFloat($scope.shippingPrice);
            ordersService.currentOrder.total = Number(ordersService.currentOrder.total.toFixed(2));
            $state.go('app.sale-flow-personal-info');
        }
    }
})();
