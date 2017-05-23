angular.module('starter').controller('loginCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, $interval, $state) {
    $scope.$on("$ionicView.enter", function (event, data) {

    });

    $scope.login = function () {
        $ionicLoading.show();
        setInterval(function () {
            $state.go('menu.home');
            $rootScope.togleActive('gohome');
            $ionicLoading.hide();
        }, 1000);

    }

    console.log("OK");
});

