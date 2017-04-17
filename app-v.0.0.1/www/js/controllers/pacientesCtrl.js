angular.module('starter').controller('pacientesCtrl', function ($scope, $rootScope) {
    $scope.$on("$ionicView.enter", function (event, data) {
        $rootScope.togleActive('gopacientes');
    });
});

