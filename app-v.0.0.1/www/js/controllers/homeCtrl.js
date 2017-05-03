angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, $interval) {
    $scope.$on("$ionicView.enter", function (event, data) {
        $ionicLoading.show();
        getMap();
        $rootScope.togleActive('gohome');
    });


    $scope.position = {};
    var options = {timeout: 10000, enableHighAccuracy: true};
    var lastUpdateTime,
minFrequency = 10*1000,
watchOptions = {
    timeout : 60*1000,
    maxAge: 0,
    enableHighAccuracy: true
};

function on_success(position){
    var now = new Date();
    if(lastUpdateTime && now.getTime() - lastUpdateTime.getTime() < minFrequency){
        console.log("Ignoring position update");
        return;
    }
    lastUpdateTime = now;
    $scope.setMakerMap(position);
    console.log("on_success");

    // do something with position
}

function on_error(position){
    console.log('Error: ', position );
}
    
    $scope.setMakerMap = function(position,mapOptions,map){
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mapOptions = {
                center: latLng,
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.map = new google.maps.Map(document.querySelector("#map"), mapOptions);
            google.maps.event.addListenerOnce($scope.map, 'idle', function () {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    //animation: google.maps.Animation.DROP,
                    position: latLng,
                    draggable: true
                });
                var infoWindow = new google.maps.InfoWindow({
                    content: "Estou Aqui!"
                });
                google.maps.event.addListener(marker, 'click', (function(marker) {
                    infoWindow.open($scope.map, marker);
                })(marker));

            });
            console.log("OK!!!");
    };


    var getMap = function () {
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        //window.navigator.geolocation.getCurrentPosition(function (position) {
            $scope.position = position;            
            //setInterval( function(){
                $scope.setMakerMap(position);
                //window.navigator.geolocation.watchPosition(on_success,on_error,watchOptions);
                $cordovaGeolocation.watchPosition(on_success,on_error,watchOptions);
            //},10000);
        }, function (error) {
            $ionicLoading.hide();
            alert(error.message);
            console.log(error);
        }).finally(function () {
            $ionicLoading.hide();
        });
    };
    
    

//$cordovaGeolocation.geolocation.watchPosition(on_success,on_error,watchOptions);
    
    /*setInterval( function(){
            getMap();
        },10000);*/

    


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

