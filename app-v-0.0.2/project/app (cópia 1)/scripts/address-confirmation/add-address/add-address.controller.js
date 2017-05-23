(function () {
    'use strict';
    angular
        .module('starter.address-confirmation')
        .controller('AddAddressController', AddAddressController);

    AddAddressController.$inject = ['$scope', '_', 'filterService', 'ionicToast', '$state', '$ionicModal', 'addressConfirmationService', 'viaCEP', '$ionicHistory', 'locationService', 'popupService', '$q'];

    function AddAddressController($scope, _, filterService, ionicToast, $state, $ionicModal, addressConfirmationService, viaCEP, $ionicHistory, locationService, popupService, $q) {
        var vm = angular.extend(this, {
            address: {
                postcode: '',
                town: '',
                locality: '',
                state: '',
                street: '',
                number: '',
                complement: ''
            },
            place: "",
            placeResult: "",
            placeChanged: placeChanged,
            type: "['address']",
            findCep: findCep,
            confirmAddress: confirmAddress,
            autoProgress: autoProgress,
            cleanAddress:cleanAddress
        });
        locationService.reverseGeoCode().then(function (result) {
            vm.place = result.address_components[1].short_name + ',' + result.address_components[0].short_name;
            addressFormat(result.address_components);
        });

        function autoProgress(cep) {
            console.log(cep)
            if (cep !== undefined) {
                findCep().then(function () {
                    document.getElementById('houseNumber').focus();
                });
            }
        }
        function placeChanged() {
            vm.placeResult = this.getPlace();
            cleanAddress();
            vm.place = vm.placeResult.formatted_address
            if (vm.placeResult.address_components) {
                vm.address.postcode =findComponent(vm.placeResult.address_components, 'postal_code', 'short_name').length==9?
                findComponent(vm.placeResult.address_components, 'postal_code', 'short_name').replace('-',""):"";
                if (_.contains(vm.placeResult.types, 'postal_code')) {
                    autoProgress(vm.address.postcode);
                } else {
                    vm.address.locality = findComponent(vm.placeResult.address_components, "sublocality_level_1", 'short_name');
                    vm.address.town = findComponent(vm.placeResult.address_components, "administrative_area_level_2", 'short_name');
                    vm.address.state = findComponent(vm.placeResult.address_components, "administrative_area_level_1", 'short_name');
                    vm.address.number = findComponent(vm.placeResult.address_components, "street_number", 'short_name');
                    vm.address.street = findComponent(vm.placeResult.address_components, "route", 'short_name') || findComponent(vm.placeResult.address_components, "sublocality_level_1", 'short_name');
                }
            }
        }

       function cleanAddress() {
            vm.address = {
                postcode: '',
                town: '',
                locality: '',
                state: '',
                street: '',
                number: '',
                complement: ''
            };
        }

        function findComponent(components, type, attr) {
            attr = attr || 'long_name';
            var n, m;
            n = components.length;
            while (n--) {
                var componentTypes = components[n].types;
                m = componentTypes.length;
                while (m--) {
                    if (componentTypes[m] === type) {
                        return components[n][attr || 'long_name'];
                    }
                }
            }

            return null;
        }

         function addressFormat(address_components) {
            vm.address.postcode = findComponent(address_components, 'postal_code', 'short_name')?
                findComponent(address_components, 'postal_code', 'short_name').replace('-',""):"";
            vm.address.locality = findComponent(address_components, "sublocality_level_1", 'short_name');
            vm.address.town = findComponent(address_components, "administrative_area_level_2", 'short_name');
            vm.address.state = findComponent(address_components, "administrative_area_level_1", 'short_name');
            vm.address.number = findComponent(address_components, "street_number", 'short_name');
            vm.address.street = findComponent(address_components, "route", 'short_name') || findComponent(address_components, "sublocality_level_1", 'short_name');

        }

        function findCep() {
            var q = $q.defer();
            viaCEP.get(vm.address.postcode).then(function (address) {
                vm.address.town = address.localidade;
                vm.address.locality = address.bairro;
                vm.address.state = address.uf;
                vm.address.street = address.logradouro;
                q.resolve();
            }, function (error) {
                ionicToast.show('CEP inválido', 'bottom', false, 2000);
                q.reject('CEP inválido');
            }).catch(function (error) {
                ionicToast.show('CEP inválido', 'bottom', false, 2000);
                q.reject('CEP inválido');
            });
            return q.promise;
        }

        vm.disableTap = function (event) {

            var input = event.target;

            // Get the predictions element
            var container = document.getElementsByClassName('pac-container');
            container = angular.element(container);

            // Apply css to ensure the container overlays the other elements, and
            // events occur on the element not behind it
            container.css('z-index', '5000');
            container.css('pointer-events', 'auto');

            // Disable ionic data tap
            container.attr('data-tap-disabled', 'true');

            // Leave the input field if a prediction is chosen
            container.on('click', function () {
                input.blur();
            });
        };

        function confirmAddress() {
            var aux = true;
            addressConfirmationService.addressCheck(vm.address).then(function (result) {
                $scope.modal.hide();
                $state.reload();
                aux = false;
            });
            if (aux) {
                locationService.validateCity(vm.address.town).then(function (isValidCity) {
                    if (isValidCity) {
                        addressConfirmationService.saveNewAddress(vm.address).then(function (result) {
                            $scope.modal.hide();
                            $state.reload();
                        });
                    } else {
                        locationService.validateState(vm.address.state).then(function (isValidState) {
                            if (isValidState) {
                                addressConfirmationService.saveNewAddress(vm.address).then(function (result) {
                                    $scope.modal.hide();
                                    $state.reload();
                                });
                            } else {
                                popupService.open('Ops!', 'O Eater não está disponível em sua região<br>=(');
                            }
                        })
                    }
                });
            }
        }
    }
})();
