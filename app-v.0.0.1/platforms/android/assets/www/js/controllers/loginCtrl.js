angular.module('starter').controller('loginCtrl', function ($scope, $ionicLoading, $state, $http, tontosService) {
    $scope.$on("$ionicView.beforeEnter", function (event, data) {         
        //getCateroias();

    });

    $scope.login = function () {
        $ionicLoading.show();
        $state.go('menu.home');
    }
    $scope.categorias = [];

    function getCateroias() {
        /*$.get("http://localhost:5000/categorias/allcategorias/", function (data, status) {
         //alert("Data: " + data + "\nStatus: " + status);
         console.log("Data: " + data + "\nStatus: " + status);
         });*/
        /*$http.get("http://localhost:5000/categorias/allcategorias/").then(function (response) {
            console.log(response.data);
        });*/

        /*$http.get("http://31.220.59.87:5000/categorias/allcategorias/").then(function (response) {
         console.log(response.data)
         });*/
        
        var str = '{"StatusReponse": "1","Categorias": [{"id_categoria":1,"nome":" Lazer e entretenimento","parent":0},{"id_categoria":2,"nome":" Acadêmico","parent":0},{"id_categoria":3,"nome":" Amigos","parent":0},{"id_categoria":4,"nome":" Serviços","parent":0}]}';
        var obj = JSON.parse(str);        
        console.log(obj);
    }    

});

