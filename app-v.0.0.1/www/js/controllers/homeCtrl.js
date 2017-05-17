angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, $interval) {
    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicLoading.show();
        getMap();
        $rootScope.togleActive('gohome');
    });


    $scope.position = {};
    var options = {timeout: 10000, enableHighAccuracy: true};
    var lastUpdateTime,
            minFrequency = 10 * 1000,
            watchOptions = {
                timeout: 60 * 1000,
                maxAge: 0,
                enableHighAccuracy: true
            };

    function on_success(position) {
        var now = new Date();
        if (lastUpdateTime && now.getTime() - lastUpdateTime.getTime() < minFrequency) {
            console.log("Ignoring position update");
            return;
        }
        lastUpdateTime = now;
        $scope.setMakerMap(position);
        console.log("on_success");
    }

    function on_error(position) {
        console.log('Error: ', position);
    }

    $scope.setMakerMap = function (position, mapOptions, map) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.querySelector("#map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
            marker = [];
            max = 10;
            min = 2;
            var markersData = [
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    nome: "Estou Aqui"
                },
                {
                    lat: position.coords.latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    lng: position.coords.longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    nome: "Bar Lada"
                },
                {
                    lat: position.coords.latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    lng: position.coords.longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    nome: "Mercado Chupin"
                },
                {
                    lat: position.coords.latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    lng: position.coords.longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    nome: "Boteco Pinga Nimim"
                },
                {
                    lat: position.coords.latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    lng: position.coords.longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                    nome: "Centro de estudos Vai que cola"
                }

            ];

            for (i = 0; i < markersData.length; i++) {
                latLng2 = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
                marker[i] = new google.maps.Marker({
                    map: $scope.map,
                    position: latLng2,
                    //draggable: true
                });
                var infoWindow = new google.maps.InfoWindow({
                    content: markersData[i].nome
                });
                google.maps.event.addListener(marker[i], 'click', (function (marker) {
                    infoWindow.open($scope.map, marker);
                })(marker[i]));
            }

        });

    };


    var getMap = function () {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            $scope.position = position;
            $scope.setMakerMap(position);
            $cordovaGeolocation.watchPosition(on_success, on_error, watchOptions);
        }, function (error) {
            $ionicLoading.hide();
            alert(error.message);
            console.log(error);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };

    $ionicModal.fromTemplateUrl('templates/home/addlocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalAddLocation = modal;
    });

    $scope.openModalAddLocation = function () {
        $scope.modalAddLocation.show();
    };
    $scope.closeModalAddLocation = function () {
        $scope.modalAddLocation.hide();
    };
    $scope.confirmarAddLocation = function () {
        $scope.modalAddLocation.hide();
    };

    window.navigator.geolocation.getCurrentPosition(function (position) {
        $scope.$apply(function () {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;

            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
            var request = {
                latLng: latlng
            };
            geocoder.geocode(request, function (data, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (data[0] != null) {
                        console.log(data);
                        console.log(data[6].formatted_address.split(',')[1].replace('-', ''));
                    } else {
                        alert("No address available");
                    }
                }
            })
            console.log(position);
        })
    })


    /*var geocoder = new google.maps.Geocoder();
     endereco = "R. Safira, 99 - Jardim Itapark Velho, Mauá - SP, 09351-525, Brasil";
     geocoder.geocode({'address': endereco + ', Brasil', 'region': 'BR'}, function (results, status) {
     if (status == google.maps.GeocoderStatus.OK) {
     if (results[0]) {
     var latitude = results[0].geometry.location.lat();
     var longitude = results[0].geometry.location.lng();
     
     $('#txtEndereco').val(results[0].formatted_address);
     $('#txtLatitude').val(latitude);
     $('#txtLongitude').val(longitude);
     var latLng = new google.maps.LatLng(latitude, longitude);
     var mapOptions = {
     center: latLng,
     zoom: 17,
     mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     map = new google.maps.Map(document.querySelector("#map"), mapOptions);
     marker = new google.maps.Marker({
     map: map,
     draggable: true,
     });
     var location = new google.maps.LatLng(latitude, longitude);
     marker.setPosition(location);
     map.setCenter(location);
     map.setZoom(16);
     }
     }
     
     
     });*/


});

