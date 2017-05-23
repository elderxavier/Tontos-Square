(function() {
    'use strict';

    angular
        .module('starter.address-confirmation')
        .factory('addressConfirmationService', addressConfirmationService);

    addressConfirmationService.$inject = ['dataService', 'firebaseDataService', 'fb', '$firebaseObject', '$firebaseArray', '$q', '$rootScope', 'ionicToast', '_'];

    /* @ngInject */
    function addressConfirmationService(dataService, firebaseDataService, fb, $firebaseObject, $firebaseArray, $q, $rootScope, ionicToast, _) {
        var service = {
            getUserAddresses: getUserAddresses,
            saveNewAddress: saveNewAddress,
            confirmCurrentAddress: confirmCurrentAddress,
            deleteAddress: deleteAddress,
            addressCheck:addressCheck,
            getAddressById: getAddressById
        }
        return service;

        function getUserAddresses() {
            var deffered = $q.defer();
            var addresses = [];

            if (!$rootScope.currentUser || !$rootScope.currentUser.addresses || $rootScope.currentUser.addresses.length == 0) {
                deffered.resolve(addresses);
                return deffered.promise;
            }

            angular.forEach($rootScope.currentUser.addresses, function(value, key) {
                var query = fb.child('addresses/' + key);
                $firebaseObject(query).$loaded().then(dataService.initItem).then(function(address) {
                    addresses.push(address);
                    if (addresses.length === _.size($rootScope.currentUser.addresses)) {
                        deffered.resolve(addresses);
                    }
                });
            });
            return deffered.promise;
        }

        function confirmCurrentAddress() {
            return $rootScope.currentUser.$save();
        }

        function deleteAddress(addressId) {
            var deffered = $q.defer();
            var query = fb.child('addresses/' + addressId);
            $firebaseObject(query).$remove().then(function(result) {
                var query = fb.child('users/' + $rootScope.currentUser.$id + '/addresses/' + addressId);
                $firebaseObject(query).$remove().then(function(result) {
                    if ($rootScope.currentUser.currentAddress === addressId) {
                        var query = fb.child('users/' + $rootScope.currentUser.$id + '/currentAddress');
                        $firebaseObject(query).$remove().then(function(result) {
                            $rootScope.currentUser.$save().then(function(result) {
                                deffered.resolve(result);
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }).catch(function(error) {
                            console.log(error);
                        });
                    } else {
                        deffered.resolve(result);
                    }
                }).catch(function(error) {
                    console.log(error);
                });

            }).catch(function(error) {
                console.log(error);
            });
            return deffered.promise;
        }

        function saveNewAddress(address) {
            var deffered = $q.defer();
            if (!$rootScope.currentUser.email) {
                deffered.reject('Necessário estar logado para realizar essa operação');
            }
            var userId = $rootScope.currentUser.$id;
            var ref = fb.child('/addresses/');
            ref.push(address).then(function(snap) {
                var ref = fb.child('/users/' + userId + '/addresses/' + snap.key);
                ref.set(true, function(result) {
                    $rootScope.currentUser.currentAddress = snap.key;
                    deffered.resolve($rootScope.currentUser.$save());
                });
                ionicToast.show('Endereço adicionado com sucesso!', 'bottom', false, 2000);
            });
            return deffered.promise;
        }

        function addressCheck(address) {
            var deffered = $q.defer();
            var userId = $rootScope.currentUser.$id;
            var all = fb.child('addresses');
            $firebaseArray(all).$loaded().then(dataService.initArray).then(function (data) {
      				angular.forEach(data, function (value, key) {
      					if(value.postcode===address.postcode&&value.number===address.number&&value.complement===address.complement){
                             var ref = fb.child('/users/' + userId + '/addresses/' + value.$id);
                            ref.set(true, function(result) {
                                 $rootScope.currentUser.currentAddress = value.$id;
                                deffered.resolve($rootScope.currentUser.$save());
                });
                ionicToast.show('Endereço adicionado com sucesso!', 'bottom', false, 2000);
            }           
                })
                
              });
               return deffered.promise;
            }
          

        function getAddressById(addressId) {
            var query = fb.child('addresses/' + addressId);
            return $firebaseObject(query).$loaded().then(dataService.initItem);
        }
    }

})();
