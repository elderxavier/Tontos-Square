(function() {
    'use strict';

    angular
        .module('starter.search', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.search', {
                    url: '/search',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/search/search.html',
                            controller: 'SearchController as vm'
                        }
                    },
                    cache: false
                }).state('app.search-results', {
                    url: '/search-results',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/search/search-results.html',
                            controller: 'SearchResultsController'
                        }
                    },
                    params: {
                        query: null
                    },
                    cache: false
                });
        });
})();
