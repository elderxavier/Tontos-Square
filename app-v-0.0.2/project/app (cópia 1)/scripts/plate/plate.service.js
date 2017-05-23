(function () {
    'use strict';

    angular
            .module('starter.plate')
            .factory('plateService', plateService);

    plateService.$inject = [
        'dataService',
        'firebaseDataService',
        'fb',
        '$firebaseObject',
        '$firebaseArray',
        '_',
        '$q'];

    /* @ngInject */
    function plateService(
            dataService,
            firebaseDataService,
            fb,
            $firebaseObject,
            $firebaseArray,
            _,
            $q) {
        var service = {
            getPlateById: getPlateById,
            getCategoryPlates: getCategoryPlates,
            getPlatesByChef: getPlatesByChef,
            getFeaturedPlates: getFeaturedPlates,
            getNewerPlatesThan: getNewerPlatesThan,
            getOlderPlatesThan: getOlderPlatesThan,
            fromCategory: fromCategory,
            fromCategory0All: fromCategory0All,
            spliceFeatured: splitFeatured,
            getPlatesOrderRatingByChef: getPlatesOrderRatingByChef,
            getChefActivePlates: getChefActivePlates,
            getOrderPlates: getOrderPlates,
            getSearch: getSearch
        };
        return service;

        function getOrderPlates(orderId) {
            var deffered = $q.defer();
            var result = [];

            var query = fb.child("order_plates/" + orderId + "/plates");
            $firebaseArray(query).$loaded().then(dataService.initArray).then(function (orderPlates) {
                angular.forEach(orderPlates, function (orderPlate, key) {
                    getPlateById(orderPlate.guid).then(function (plate) {
                        plate.quantity = orderPlate.quantity;
                        plate.price = orderPlate.price;
                        result.push(plate);
                        if (orderPlates.length === _.size(result)) {
                            deffered.resolve(result);
                        }
                    }).catch(function (error) {
                        console.log(error);
                        deffered.reject(error);
                    });
                });
            }).catch(function (error) {
                console.log(error);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function getPlateById(plateId) {
            var query = fb.child('plates/' + plateId);
            return $firebaseObject(query).$loaded().then(dataService.initItem);
        }

        function getPlatesByChef(chefId) {
            var query = fb.child('plates/').orderByChild('chef').equalTo(chefId);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function getCategoryPlates(categoryId) {
            var query = fb.child('plates/').orderByChild('category').equalTo(categoryId).limitToLast(10);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function getFeaturedPlates() {
            var query = fb.child('plates/').orderByChild('isFeatured').equalTo(true);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function getNewerPlatesThan(plateId, categoryId) {
            var query = fb.child('category_plates/' + categoryId).orderByKey().startAt(plateId);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function getOlderPlatesThan(plateId) {
            var query = fb.child('plates/').orderByKey().endAt(plateId).limitToLast(11);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function fromCategory(categoryId) {
            var query = fb.child('active/category_plates/' + categoryId + '/plates').orderByKey().limitToLast(10);
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(dataService.getGuids).then(dataService.resolve('plates').fromList);
        }

        function fromCategory0All() {
            var query = fb.child('active/category_plates/0-all/plates').orderByKey().limitToLast(10);
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(dataService.getGuids).then(dataService.resolve('plates').fromList);
        }

        function splitFeatured(plates) {
            return {
                normal: _.filter(plates, function (plate) {
                    return !plate.isFeatured
                }),
                featured: _.filter(plates, function (plate) {
                    return plate.isFeatured
                })
            };
        }

        function getPlatesOrderRatingByChef(chefId) {
            var query = fb.child('plates/').orderByChild('chef').equalTo(chefId);
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(function (plates) {
                return plates.sort(function (a, b) {
                    if (a.rating > b.rating) {
                        return 1;
                    }
                    if (a.rating < b.rating) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                })
            });
        }

        function getChefActivePlates(chefId) {
            var query = fb.child('active/chefs/' + chefId + '/plates').orderByKey();
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(dataService.getGuids).then(dataService.resolve('plates').fromList);
        }

        function getSearch() {            
            var query = fb.child('plates/');
            return $firebaseArray(query).$loaded().then(dataService.initArray);            
        } 
    }
})();
