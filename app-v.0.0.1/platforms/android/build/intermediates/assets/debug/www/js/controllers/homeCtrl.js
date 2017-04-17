angular.module('starter').controller('homeCtrl', function ($scope, $rootScope, $cordovaGeolocation) {
    $scope.$on("$ionicView.enter", function (event, data) {
        //$rootScope.togleActive('gohome');
    });
   

    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var cord = {
            latitude:-23.6819559,
            longitude:-46.4318313
        };
        var latLng = new google.maps.LatLng(cord.latitude, cord.longitude);
        

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.querySelector("#map"), mapOptions);
        
        /*
         google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });      
 
});
         
         
         */

        /*google.maps.event.addListenerOnce($scope.map, 'idle', function () {

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

        });*/


    }, function (error) {
        
        alert(error.toString());
        console.log(error);
    });



$rootScope.checkPermission = function() {
  setLocationPermission = function() {
    cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
      switch (status) {
        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
          break;
        case cordova.plugins.diagnostic.permissionStatus.DENIED:
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
          break;
        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
          break;
      }
    }, function(error) {}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);
  };
  cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
    switch (status) {
      case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
        break;
      case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
        setLocationPermission();
        break;
      case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
        setLocationPermission();
        break;
      case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
        setLocationPermission();
        break;
    }
  }, function(error) {}, cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION);
};


});

