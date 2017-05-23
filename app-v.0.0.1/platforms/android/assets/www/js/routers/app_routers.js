(function () {
    "use strict";

    angular.module("starter").config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
                // setup an abstract state for the menus directive
                .state('menu', {
                    url: '/menu',
                    abstract: true,
                    controller: 'MenuLeftCtrl',
                    templateUrl: 'templates/menu/menu.html'
                })
                
                .state('menu.home', {
                    url: '/home',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/home.html',
                            //controller: 'homeCtrl'
                        }
                    }
                })
                /*Section Agenda*/
                .state('menu.login', {
                    url: '/login',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/login.html',
                            controller: 'loginCtrl'
                        }
                    }
                });        
        $urlRouterProvider.otherwise('/menu/login');
    })
})();
