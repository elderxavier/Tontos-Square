angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, tontosService) {

    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicLoading.show();
        getMap();
        $rootScope.togleActive('gohome');
        getCategoria();
    });
    /*init vars*/

    $scope.position = {
        "latitude": 0,
        "longitude": 0
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
        setMap(position);
        console.log("on_success");
    }

    function on_error(position) {
        console.log('Error: ', position);
    }

    function setMap(latitude, longitude) {
        var mapOptions = {
            center: {lat: latitude, lng: longitude},
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        getPost();
    }


    function addMarker(latitude, longitude, titulo) {
        //new google.maps.event.addListenerOnce($scope.map, 'idle', function () {        
        latLng = new google.maps.LatLng(latitude, longitude);
        marker = new google.maps.Marker({
            position: latLng,
            map: $scope.map
        });

        infoWindow = new google.maps.InfoWindow({
            content: titulo
        });
        infoWindow.open($scope.map, marker);
        marker.addListener('click', function (evt) {
            $scope.map.setZoom($scope.map.getZoom() + 1);
            infoWindow.setContent(titulo);
            infoWindow.setPosition(evt.latLng);
            infoWindow.open($scope.map);
        });
    }


    function getMap() {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            $scope.position.latitude = position.coords.latitude;
            $scope.position.longitude = position.coords.longitude;
            setMap($scope.position.latitude, $scope.position.longitude);
            $cordovaGeolocation.watchPosition(on_success, on_error, watchOptions);
            EndByLatLng($scope.position.latitude, $scope.position.longitude);
            console.log(position.coords.latitude, position.coords.longitude);
            $ionicLoading.hide();
            addMarker($scope.position.latitude, $scope.position.longitude, "Estou Aqui");

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
        $scope.position.latitude = place.geometry.location.lat();
        $scope.position.longitude = place.geometry.location.lng();
        setMap($scope.position.latitude, $scope.position.longitude);
        addMarker($scope.position.latitude, $scope.position.longitude, "Estou Aqui");
        EndByLatLng($scope.position.latitude, $scope.position.longitude);

        //var latlng = new google.maps.LatLng(latitude, longitude);
        //$scope.map.setCenter(latlng);
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


    /*Categorias*/
    $scope.categorias = [];
    function getCategoria() {
        url = "/categorias/allcategorias/";
        method = "GET";
        tontosService.getResults(url, method).run.then(
                function successCallback(response) {
                    if (response.data.status != -1 && response.data.StatusReponse == 1) {
                        $scope.categorias = response.data.Categorias;
                    }
                }, function errorCallback(error) {
            console.error("ERROR: ", error);
            alert("ERROR: Sem conexao com servidor");
            return false;
        }, 'json')
    }

    /*Locais*/
    $rootScope.UserId = 1;
    $scope.setPost = function () {
        $ionicLoading.show();
        fromname = $('#formCheckin')[0];
        msgError = "";
        valid = true;
        $('#formCheckin .required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('not-valid');
                valid = false;
            } else if (!$(this).val().trim()) {
                $(this).addClass('not-valid');
                valid = false;
            }
        });
        if (!valid) {
            $ionicLoading.hide();
            return;
        }

        url = "/post/addlocation/" + $rootScope.UserId + "/" + $('#formCheckin #categoria').val() + "/" + $('#formCheckin #titulo').val() + "/" + $scope.position.latitude + "/" + $scope.position.longitude + "/";
        method = "POST";
        console.log(url);
        tontosService.getResults(url, method).run.then(
                function successCallback(response) {
                    if (response.data.status != -1 && response.data.StatusReponse == 1) {
                        addMarker($scope.position.latitude, $scope.position.longitude, $('#formCheckin #titulo').val());
                        $scope.modalAddLocation.hide();
                        $ionicLoading.hide();
                    }
                },
                function errorCallback(error) {
                    console.log("ERROR: ", error);
                    $ionicLoading.hide();
                    return false;
                },
                'json')
    }


    function getPost() {
        //http://localhost:5000/post/mylocations/-23.6821885/-46.4321185/AE3998A5B3F84DD16E872ED37BCFE/	
        url = "/post/mylocations/" + $scope.position.latitude + "/" + $scope.position.longitude + "/";
        method = "GET";
        console.log(url);
        tontosService.getResults(url, method).run.then(
                function successCallback(response) {
                    if (response.data.status != -1 && response.data.StatusReponse == 1) {
                        console.log(response.data);
                        for (i = 0; i < response.data.Post.length; i++) {
                            addMarker(response.data.Post[i].latitude, response.data.Post[i].longitude, response.data.Post[i].titulo);
                        }
                    }
                }, function errorCallback(error) {
            console.error("ERROR: ", error);
            alert("ERROR: Sem conexao com servidor");
            return false;
        }, 'json')
    }

});

