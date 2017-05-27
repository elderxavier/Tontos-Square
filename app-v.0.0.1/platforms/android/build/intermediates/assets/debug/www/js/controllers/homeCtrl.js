angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading) {

    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicLoading.show();
        getMap();
        $rootScope.togleActive('gohome');
    });
    /*init vars*/
    
    $scope.position = {
        "latitude": 0,
        "longitude":0        
    };
    
    $scope.md_endereco = "";
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

    function setMakerMap(markersData, latitude, longitude) {        
        var mapOptions = {            
            center: {lat: latitude, lng: longitude},
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };       
        marker = [];
        max = 10;
        min = 2;
        $scope.markersData = [
            {
                lat: latitude,
                lng: longitude,
                nome: "Estou Aqui"
            },
            {
                lat: latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                lng: longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                nome: "Bar Lada"
            },
            {
                lat: latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                lng: longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                nome: "Mercado Chupin"
            },
            {
                lat: latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                lng: longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                nome: "Boteco Pinga Nimim"
            },
            {
                lat: latitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                lng: longitude + ((1 / 3600) * (Math.random() * (max - min) + min)),
                nome: "Centro de estudos Vai que cola"
            }

        ];
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.infoWindowArr = [];
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
            for (i = 0; i < $scope.markersData.length; i++) {
                latLng = new google.maps.LatLng($scope.markersData[i].lat, $scope.markersData[i].lng);
                marker[i] = new google.maps.Marker({
                    map: $scope.map,
                    position: latLng,
                    //draggable: true
                });
                $scope.infoWindow = new google.maps.InfoWindow({
                    content: $scope.markersData[i].nome
                });
                $scope.infoWindow.open($scope.map, marker[i]);
                google.maps.event.addListener(marker[i], 'click', (function (marker) {
                    $scope.infoWindow.open($scope.map, marker[i]);
                    //})(marker));
                }));
            }
        });

    }


    function getMap() {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {            
            $scope.position.latitude = position.coords.latitude;
            $scope.position.longitude = position.coords.longitude;            
            setMakerMap($scope.markersData, $scope.position.latitude, $scope.position.longitude);
            $cordovaGeolocation.watchPosition(on_success, on_error, watchOptions);
            EndByLatLng($scope.position.latitude, $scope.position.longitude);
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


    function EndByLatLng(latitude, longitude) {
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(latitude, longitude);
        geocoder.geocode({'location': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $scope.endereco = results[0].address_components[1].short_name + ", " + results[0].address_components[0].short_name + ", " + results[0].address_components[2].short_name + " - " + results[0].address_components[3].short_name;
                    $scope.md_endereco = $scope.endereco;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    function fillInAddress() {
        var place = $scope.searchBox.getPlace();
        var latitude = place.geometry.location.lat();
        var longitude = place.geometry.location.lng();
        $scope.position = place.geometry.location;
        setMakerMap($scope.markersData, latitude, longitude);
        EndByLatLng(latitude, longitude);
    }

    $scope.searchBox = new google.maps.places.Autocomplete((document.getElementById('endereco')), {types: ['geocode']});
    google.maps.event.addListener($scope.searchBox, 'place_changed', function () {
        fillInAddress();
    });




    $scope.checkEmpityEndereco = function () {
        if (!$scope.md_endereco.trim()) {
            $scope.md_endereco = $scope.endereco;
        }
    }

    $(document).on('focusout', '#endereco', function () {
        $scope.checkEmpityEndereco();
    });
    
});

