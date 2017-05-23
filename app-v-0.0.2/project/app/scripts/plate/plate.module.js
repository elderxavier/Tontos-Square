(function() {
    'use strict';

    angular
        .module('starter.plate', [
            'ionic',
            'ngCordova',
            'starter.common',
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.plate', {
                    url: '/plate/:plateId',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/plate/plate.html',
                            controller: 'PlateController as vm'
                        }
                    },
                    resolve: {
                        plate: ['homePlatesService', function(homePlatesService) {
                            return homePlatesService.selected;
                        }],
                        tags: ['tagsService', 'plate', function(tagsService, plate) {
                            return tagsService.getPlateTags(plate).then(function(tags) {
                                return tags;
                            }).catch(function(error) {
                                console.log(error);
                            });

                        }],
                        reviews: ['reviewService', 'plate', function(reviewService, plate) {
                            return reviewService.getPlateReviews(plate).then(function(reviews) {
                                return reviews;
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }],
                        chef: ['plate', function(plate) {
                            return plate.chef;
                        }],
                        category: ['$stateParams', 'categoriesService', 'plate', function($stateParams, categoriesService, plate) {
                            var categoryId = plate.category;
                            return categoriesService.getCategoryById(categoryId);
                        }],
                        labor: ['laborService', function(laborService) {
                            return laborService.getSelectedOrCreate().then(function(labor) {
                                return labor;
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }]
                    }
                })
                .state('app.plates', {
                    url: '/plates/:categoryId?categoryName',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/plate/plates.html',
                            controller: 'PlatesController as vm'
                        }
                    }
                });
        });
})();
