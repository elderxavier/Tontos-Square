angular.module('starter').controller('loginCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicModal, $ionicLoading, $interval, $state) {
    $scope.$on("$ionicView.enter", function (event, data) {

    });

    $scope.login = function () {
        $ionicLoading.show();
        $state.go('menu.home');        
    }

    
});

