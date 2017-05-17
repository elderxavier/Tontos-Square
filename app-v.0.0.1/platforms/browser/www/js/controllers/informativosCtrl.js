angular.module('starter').controller('informativosCtrl', function ($scope, $rootScope) {
    $scope.$on("$ionicView.enter", function (event, data) {
        $rootScope.togleActive('goinformativos');
    });
});

