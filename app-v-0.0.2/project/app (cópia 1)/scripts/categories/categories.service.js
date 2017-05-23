(function() {
    'use strict';

    angular
        .module('starter.categories')
        .factory('categoriesService', categoriesService);

    categoriesService.$inject = ['dataService', '$firebaseObject', 'fb', '$firebaseArray'];

    /* @ngInject */
    function categoriesService(dataService, $firebaseObject, fb, $firebaseArray) {
        var service = {
            getCategories: getCategories,
            getCategoryById: getCategoryById,
            getFeaturedCategories: getFeaturedCategories
        };
        return service;

        // ******************************************************************

        function getCategories() {
            var query = fb.child('categories');
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        function getCategoryById(id) {
            var query = fb.child('categories/' + id);
            return $firebaseObject(query).$loaded().then(dataService.initItem);
        }

        function getFeaturedCategories() {
            var query = fb.child('categories').orderByChild('featured').equalTo(true);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }
    }
})();
