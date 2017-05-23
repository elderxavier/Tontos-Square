(function() {
    'use strict';

    var app = angular.module('starter.home');

    app.factory('categoryService', categoryService);

    categoryService.$inject = ['dataService', 'fb', '$firebaseArray']

    function categoryService (dataService, fb, $firebaseArray) {
        var current = {} ;

        var featured = function () {
            var query = fb.child('categories').orderByChild('featured').equalTo(true);
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        };

        var setCurrent = function (categorie) {
            current = {};
            if(categorie === '0-all'){
                current.title = 'Todos os produtos';
                current.guid = categorie;
            } else {
                current = categorie;
            }
        };

        var getCurrent = function () {
            return current;
        };

        return {
            featured: featured,
            setCurrent: setCurrent,
            getCurrent: getCurrent
        };
    }
})();
