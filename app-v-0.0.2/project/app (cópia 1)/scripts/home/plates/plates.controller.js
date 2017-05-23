    (function() {
        'use strict';

        angular
            .module('starter.home')
            .controller('HomePlatesController', HomePlatesController);

        HomePlatesController.$inject = ['$scope', 'homeService', '$ionicLoading', '$state', 'restaurantCartService', 'categoryService', 'verticalScrollService', 'homePlatesService', 'laborService', 'laborModalService', 'homeSearchService', '_', '$filter']

        function HomePlatesController($scope, homeService, $ionicLoading, $state, restaurantCartService, categoryService, verticalScrollService, homePlatesService, laborService, laborModalService, homeSearchService, _, $filter) {

            var more = true;
            var plateFilters = {
                'at-hand': function(plate) {
                    return $scope.isAvailable(plate, $scope.labor);
                },
                'schedule': function(plate) {
                    return $scope.isAvailable(plate, $scope.labor);
                },
                'show-all': function(plate) {
                    return true;
                },
            };

            $scope.isAtHand = function(plate) {
                return $scope.labor.matchWithAny(plate.chef.labors);
            };

            $scope.isAvailable = function(plate, labor) {
                return labor.matchWithAny(plate.chef.labors);
            };

            laborService.on('change', function(labor) {
                $scope.fetch();
            });

            $scope.goLabor = function() {
                laborModalService.modal.toggle();
            };

            $scope.setCheckoutMode = function(plate) {
                laborModalService.setCheckoutMode(plate);
            };

            homeService.on('plates', function(plates) {
                plates ? plates : plates = {};
                const laborFilter = plateFilters[$scope.labor.availability];
                $scope.featured = plates.featured || [];
                $scope.normal = plates.normal || [];
                if (laborFilter) {
                    $scope.featured = $scope.featured.filter(laborFilter);
                    $scope.normal = $scope.normal.filter(laborFilter);
                }
            });

            homeService.on('category', function() {
                $scope.fetch();
            });

            $scope.fetch = function() {
                categoryService.featured().then(function() {
                    $ionicLoading.show();
                    homeService.fetch().then(function(plates) {
                        $ionicLoading.hide();
                        homeService.emit('plates', [plates]);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                });
                more = !more;
            };

            $scope.thereIsMore = function() {
                return more;
            };

            $scope.showPlateDetails = homePlatesService.showPlateDetails;

            $scope.quickAddToCart = function(plate) {
                restaurantCartService.addToCart(plate, 1);
                $state.go('app.restaurant-cart');
            };

            homeSearchService.on('quest', function(questedString) {
                if (!questedString || questedString === ' ') return $scope.fetch();

                $ionicLoading.show();
                homeService.fetch().then(function(plates) {
                    $ionicLoading.hide();
                    // plates.featured = _.filter(plates.featured, function(plate) {
                    //     return plate.name.toLocaleLowerCase().indexOf(questedString.toLowerCase()) !== -1;
                    // });
                    // plates.normal = _.filter(plates.normal, function(plate) {
                    //     return plate.name.toLocaleLowerCase().indexOf(questedString.toLowerCase()) !== -1;
                    // });


                    plates.featured = _.filter(plates.featured, function(plate) {
                        return matches(plate, questedString);
                    });
                    plates.normal = _.filter(plates.normal, function(plate) {
                        return matches(plate, questedString);
                    });


                    homeService.emit('plates', [plates]);
                });
            });


            function latinize(text) {
                return $filter('latinize')(text);
            }

            function matches(plate, questedString) {
                var latinizedText = latinize(questedString.toLowerCase());

                return latinize(plate.name.toLocaleLowerCase()).indexOf(latinizedText) !== -1 ||
                    latinize(plate.ingredients.toLocaleLowerCase()).indexOf(latinizedText) !== -1 ||
                    latinize(plate.description.toLocaleLowerCase()).indexOf(latinizedText) !== -1;
            }

            homeSearchService.on('clear', function() {
                return $scope.fetch();
            });

            verticalScrollService.add('plate-carousel');
        }
    })();
