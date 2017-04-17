angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal) {
    $scope.$on("$ionicView.enter", function (event, data) {
        //$rootScope.togleActive('gohome');
    });


    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
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
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            var infoWindow = new google.maps.InfoWindow({
                content: "Estou Aqui!"
            });
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

        });

    }, function (error) {
        alert(error.message);
        console.log(error);
    });
    
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


});

