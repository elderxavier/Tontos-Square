(function () {
    'use strict';

    angular
        .module('starter.sale-flow')
        .controller('PaymentModalController', PaymentModalController);

    PaymentModalController.$inject = ['$scope', 'ordersService', '$state', 'deliveryMethod', 'viaCEP', 'paymentModalService', 'ionicToast', 'iuguService'];

    function PaymentModalController($scope, ordersService, $state, deliveryMethod, viaCEP, paymentModalService, ionicToast, iuguService) {

        var addressForShipping = false;

        if (ordersService.currentOrder && ordersService.currentOrder.address) {
            addressForShipping = {
                number: ordersService.currentOrder.address.number,
                locality: ordersService.currentOrder.address.locality,
                street: ordersService.currentOrder.address.street,
                complement: ordersService.currentOrder.address.complement,
                postcode: ordersService.currentOrder.address.postcode
            }
        }
         
        var withdraw = ordersService.currentOrder.deliveryMethod === deliveryMethod.WITHDRAW;

        var vm = angular.extend(this, {
            findCep: findCep,
            paymentMethod:{},
            addressForShipping: addressForShipping,
            save: save,
            autoProgress: autoProgress,
            withdraw: withdraw,
            nextInputYear: nextInputYear,
            nextInputCvc: nextInputCvc,
            modal: paymentModalService.getModal()
        });

        $scope.onChange = function ($event) {
            $event.target.value ? $scope[$event.target.name + "FieldFilled"] = true : $scope[$event.target.name + "FieldFilled"] = false;
        }

        $scope.sameAddressForPayment = {
            on: false
        };
        function autoProgress(cep) {
            if (cep) {
                findCep().then(function () {
                    document.getElementById('streetNumber').focus();
                });
            }
        }

        function nextInputYear(month) {
            if (month.toString().length == 2) {
                document.getElementById('year').focus();
            }
        }
        function nextInputCvc(year) {
            if (year.toString().length == 4) {
                document.getElementById('cvc').focus();
            }
        }

        function findCep() {
            if (vm.paymentAddress && vm.paymentAddress.postcode) {
                return viaCEP.get(vm.paymentAddress.postcode).then(function (address) {
                    vm.paymentAddress.town = address.localidade;
                    vm.paymentAddress.locality = address.bairro;
                    vm.paymentAddress.state = address.uf;
                    vm.paymentAddress.street = address.logradouro;
                }, function (error) {
                    ionicToast.show('CEP inválido', 'bottom', false, 2000);
                }).catch(function (error) {
                    ionicToast.show('CEP inválido', 'bottom', false, 2000);
                });
            }
        }

        function save(paymentMethod) {
            var name = paymentModalService.paymentMethodName;
            var names = name.split(' ');
            var firstName = names[0];
            var lastName = "undefined";

            if (names.length > 1) {
                lastName = names.slice(1).join(' ');
            }

            paymentMethod.month = paymentMethod.month.toString();
            paymentMethod.year = paymentMethod.year.toString();

            paymentMethod.firstName = firstName;
            paymentMethod.lastName = lastName;

            iuguService.createPaymentMethod(paymentMethod).then(function (result) {
                paymentModalService.paymentMethods.push(result.data.paymentMethod);
                ordersService.currentOrder.paymentMethod = result.data.paymentMethod;
                $scope.modal.hide()
            });
        }
    }
})();
