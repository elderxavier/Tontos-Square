(function () {
    'use strict';

    angular
            .module('starter.location')
            .factory('locationService', locationService);

    locationService.$inject = [
        '$ionicPopup',
        '$state',
        'viaCEP',
        'fb',
        '$firebaseObject',
        '$q',
        '$cordovaGeolocation',
        'popupService',
        'ionicToast'
    ];

    /* @ngInject */
    function locationService(
            $ionicPopup,
            $state,
            viaCEP,
            fb,
            $firebaseObject,
            $q,
            $cordovaGeolocation,
            popupService,
            ionicToast) {

        var map = {
            centerPosition: {
                latitude: 0,
                longitude: 0
            },
            markerPosition: {
                latitude: 0,
                longitude: 0
            },
            cep: 0,
            confirmed: false,
            gpsOn: false
        };

        var backButton = {hide: false};

        var service = {
            updateLocation: updateLocation,
            confirmLocation: confirmLocation,
            isGpsOn: isGpsOn,
            getLatLongByAddress: getLatLongByAddress,
            isConfirmed: isConfirmed,
            getPosition: getPosition,
            updateMap: updateMap,
            getCenterPositionLatitude: getCenterPositionLatitude,
            getCenterPositionLongitude: getCenterPositionLongitude,
            getMarkerPositionLatitude: getMarkerPositionLatitude,
            getMarkerPositionLongitude: getMarkerPositionLongitude,
            validateCep: validateCep,
            backButton: backButton,
            hideBackButton: hideBackButton,
            reverseGeoCode: reverseGeoCode,
            //validateState: validateState,
            //validateCity: validateCity,
            getDistanceBetweenAddresses: getDistanceBetweenAddresses
        };

        return service;

        function hideBackButton() {
            backButton.hide = true;
        }

        function isGpsOn() {
            return map.gpsOn;
        }

        function isConfirmed() {
            return map.confirmed;
        }

        function updateLocation() {
            var position = this.getPosition();
            updateMap(position);
            map.confirmed = false;
        }

        function confirmLocation() {
            map.confirmed = true;
            ionicToast.show('Localização salva', 'bottom', false, 2000);
            /*var alertPopup = $ionicPopup.alert({
             title: 'Sucesso.',
             template: 'Localização salva!',
             cssClass: 'popup'
             });*/
            $state.go('app.home');
        }


        function getPosition() {
            var posOptions = {timeout: 10000, enableHighAccuracy: true};
            return $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(getPositionSuccess, getPositionError);
        }

        function getPositionSuccess(position) {
            map.gpsOn = true;
            map.confirmed = false;
            map.centerPosition.latitude = position.coords.latitude;
            map.centerPosition.longitude = position.coords.longitude;
            map.markerPosition.latitude = position.coords.latitude;
            map.markerPosition.longitude = position.coords.longitude;
        }

        function getPositionError(error) {
            map.gpsOn = false;
            console.log(error);
        }

        function updateMap(position) {
            map.centerPosition.latitude = position.lat();
            map.centerPosition.longitude = position.lng();
            map.markerPosition.latitude = position.lat();
            map.markerPosition.longitude = position.lng();
        }

        function getCenterPositionLatitude() {
            return map.centerPosition.latitude;
        }

        function getCenterPositionLongitude() {
            return map.centerPosition.longitude;
        }

        function getMarkerPositionLatitude() {
            return map.markerPosition.latitude;
        }

        function getMarkerPositionLongitude() {
            return map.markerPosition.longitude;
        }

        function validateCep(cep) {
            var deferred = $q.defer();
            viaCEP.get(cep).then(function (address) {
                validateAvalibleAddress(address).then(function (valid) {
                    if (valid) {
                        ionicToast.show('CEP validado', 'bottom', false, 2000);

                        /*var alertPopup = $ionicPopup.alert({
                         title: 'Sucesso.',
                         template: 'CEP autorizado!',
                         cssClass: 'popup'
                         });*/
                        deferred.resolve(true);

                    } else {
                        // ionicToast.show('CEP inválido', 'middle', false, 2000);
                        /*var alertPopup = $ionicPopup.alert({
                         title: 'Ops...',
                         template: 'O Eater não está disponivel na sua região!',
                         cssClass: 'popup'
                         });*/
                        
                        deferred.resolve(false);
                    }
                })
            }, function (error) {
                console.log(error);
                /*var alertPopup = $ionicPopup.alert({
                 title: 'Ops...',
                 template: 'CEP inexistente!',
                 cssClass: 'popup'
                 });*/
                //ionicToast.show('CEP inválido', 'middle', false, 2000);
                popupService.open('Ops!', 'CEP inválido');
                deferred.resolve(false);
            });
            return deferred.promise;
        }


        function validateAvalibleAddress(address) {
            var state = address.uf;
            var city = address.localidade;
            var deferred = $q.defer();

            validateState(state).then(function (valid) {
                if (valid) {
                    deferred.resolve(true);
                } else {
                    validateCity(city).then(function (valid) {
                        deferred.resolve(valid);
                    })
                }
            });

            return deferred.promise;
        }

        function validateState(state) {
            var deferred = $q.defer();
            var query = fb.child('states').orderByChild('name').equalTo(state);
            var obj = $firebaseObject(query);
            var stateValid = false;
            obj.$loaded(function (result) {
                angular.forEach(result, function (value, key) {
                    if (value.name === state) {
                        stateValid = true;
                    } else {
                        stateValid = false;
                    }
                });
                deferred.resolve(stateValid);
            });

            return deferred.promise;
        }

        function validateCity(city) {
            var deferred = $q.defer();
            var query = fb.child('cities').orderByChild('name').equalTo(city);
            var obj = $firebaseObject(query);
            var cityValid = false;
            obj.$loaded(function (result) {
                angular.forEach(result, function (value, key) {
                    if (value.name === city) {
                        cityValid = true;
                    } else {
                        cityValid = false;
                    }
                });
                deferred.resolve(cityValid);
            });
            return deferred.promise;
        }

        function reverseGeoCode() {
            // Se o ReverseGeocode for chamado antes do "getPosition", não haverá nenhuma localização disponível
            var promise = isGpsOn() ? $q.resolve() : getPosition();
            return promise
                    .then(function () {
                        var lat = getMarkerPositionLatitude();
                        var lng = getMarkerPositionLongitude();
                        var latlng = new google.maps.LatLng(lat, lng);
                        return doReverseGeocode(latlng);
                    });
        }

        function doReverseGeocode(latlng) {
            var mockReverseGeocode = {
                isMock: true,
                formatted_address: 'Localização não disponível',
            };
            return $q(function (resolve) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({'latLng': latlng}, function (results, status) {
                    // Caso nenhum resultado seja encontrado, exibimos uma localização falsa indicando o problema
                    var result = mockReverseGeocode;
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            result = results[0];
                        }
                    }
                    resolve(result);
                });
            })
        }

        function getDistanceBetweenAddresses(originAddress, destinationAddress) {
            var deferred = $q.defer();

            getLatLongByAddress(originAddress).then(function (originLatLng) {
                getLatLongByAddress(destinationAddress).then(function (destinationLatLng) {
                    deferred.resolve(haversine(originLatLng, destinationLatLng));
                });
            });
            return deferred.promise;
        }
        ;

        function getLatLongByAddress(address) {
            var deferred = $q.defer();
            var formattedAddress = address.street + ' ' + address.number + ', ' + address.town + ' - ' + address.state;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': formattedAddress}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    deferred.resolve(results[0].geometry.location);
                }

            });
            return deferred.promise;
        }

        //Haversine formula returns the distance in meter
        function haversine(originLatLng, destinationLatLng) {
            var earthRadius = 6378137;
            var diferenceLat = rad(destinationLatLng.lat() - originLatLng.lat());
            var diferenceLong = rad(destinationLatLng.lng() - originLatLng.lng());
            var a = Math.sin(diferenceLat / 2) * Math.sin(diferenceLat / 2) +
                    Math.cos(rad(originLatLng.lat())) * Math.cos(rad(destinationLatLng.lat())) *
                    Math.sin(diferenceLong / 2) * Math.sin(diferenceLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = earthRadius * c;
            return parseInt(distance);
        }

        // rad formula
        function rad(x) {
            return x * Math.PI / 180;
        }
        ;

    }
})();
