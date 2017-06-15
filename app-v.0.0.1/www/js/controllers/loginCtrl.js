angular.module('starter').controller('loginCtrl', function ($scope, $ionicLoading, $state, $http, tontosService) {   

    $scope.login = function () {
        $ionicLoading.show();
        url = "/login/allcategorias/";
        method = "GET";
        tontosService.getResults(url, method).run.then(
                function successCallback(response) {
                    if (response.data.status != -1 && response.data.StatusReponse == 1) {
                        $scope.login = response.data.islogin;
                    }
                }, function errorCallback(error) {
            console.error("ERROR: ", error);
            alert("ERROR: Sem conexao com servidor");
            return false;
        }, 'json')
        
        $state.go('menu.home');
    }
    

});

