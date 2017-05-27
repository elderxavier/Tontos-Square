angular.module('starter').controller('MenuLeftCtrl', function ($scope, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory, $rootScope) {
    $rootScope.backHistory = function () {
        $ionicHistory.goBack();
    }
    //menu
    $rootScope.togleActive = function (id) {
        $('.menu-left .item').removeClass('active');
        $('#' + id).closest('.item').addClass('active');
    };
    
    $rootScope.goScreen = function (endereco, id) {
        $rootScope.togleActive(id)
        $ionicSideMenuDelegate.toggleLeft();
        $state.go(endereco);
        
    };
    $rootScope.goHome = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.home');
        template: 'Loading';        
    };
    $rootScope.goAgenda = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.agenda');
        template: 'Loading';        
    };
    $rootScope.goPacientes = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.pacientes');
        template: 'Loading';        
    };
    $rootScope.goInformativos = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.informativos');
        template: 'Loading';        
    };
    $rootScope.goEvolucao = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.detalhes-evolucao');
        template: 'Loading';        
    };
    
    //helpers functions private
    $timeout(function () {
    }, 3500);

})