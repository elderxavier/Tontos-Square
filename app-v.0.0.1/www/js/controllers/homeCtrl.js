angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, $interval) {

    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicLoading.show();
        getMap();
        $rootScope.togleActive('gohome');
    });


    var options = {timeout: 10000, enableHighAccuracy: true};
    var lastUpdateTime;
    minFrequency = 10 * 1000;
    watchOptions = {
        timeout: 60 * 1000,
        maxAge: 0,
        enableHighAccuracy: true
    };
    function on_success(position) {
        setMakerMap(position);
        console.log("on_success");
    }

    function on_error(position) {
        console.log('Error: ', position);
    }

    function setMakerMap(position, mapOptions, map) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        //var target = angular.element("#map");
        //var map = new google.maps.Map(document.querySelector("#map"), mapOptions);
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
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
                    infoWindow.open(map, marker);
                })(marker[i]));
            }

        });

    }
    function getMap() {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            var position = position;
            setMakerMap(position);
            $cordovaGeolocation.watchPosition(on_success, on_error, watchOptions);
        }, function (error) {
            $ionicLoading.hide();
            alert(error.message);
            console.log(error);
        }).finally(function () {
            $ionicLoading.hide();
        });
    }


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
});

