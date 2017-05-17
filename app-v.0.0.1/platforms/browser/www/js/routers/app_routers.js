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
                .state('menu.agenda', {
                    url: '/agenda',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })                 
                .state('menu.detalhes-outrasinformacoes', {
                    url: '/detalhes/outrasinformacoes',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda/tabs/outrasinformacoes.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })                
                .state('menu.detalhes-protocolos', {
                    url: '/detalhes/protocolos',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda/tabs/protocolos.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })                
                .state('menu.detalhes-riscos', {
                    url: '/detalhes/riscos',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda/tabs/riscos.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })                
                .state('menu.detalhes-evolucao', {
                    url: '/detalhes/evolucao',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda/tabs/evolucao.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })                
                .state('menu.detalhes-historico', {
                    url: '/detalhes/historico',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/agenda/tabs/historico.html',
                            controller: 'agendaCtrl'
                        }
                    }
                })
                
                /*end Section Agenda*/
                .state('menu.pacientes', {
                    url: '/pacientes',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/pacientes.html',
                            controller: 'pacientesCtrl'
                        }
                    }
                })

                .state('menu.informativos', {
                    url: '/informativos',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/informativos.html',
                            controller: 'informativosCtrl'
                        }
                    }
                })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/menu/home');
    })
})();
