(function() {
    'use strict';

    angular
        .module('starter.tags')
        .factory('tagsService', tagsService);

    tagsService.$inject = ['dataService', 'fb', '$firebaseArray', '$firebaseObject', '$q', '_', 'asyncService'];

    /* @ngInject */
    function tagsService(dataService, fb, $firebaseArray, $firebaseObject, $q, _, asyncService) {

        var service = {
            getAllTags: getAllTags,
            getPlateTags: getPlateTags,
            populate: populate
        };

        return service;

        function getAllTags() {
            var query = fb.child('tags/');
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }
        
        function populate(plates) {
            var deffered = $q.defer();
            
            asyncService.iterate(plates, function(plate, next) {
                getPlateTags(plate).then(function(tags) {
                   plate.tags = tags;
                    next();
                });
            }, function() {
                deffered.resolve(plates);
            });
            
            return deffered.promise;
        }

        function getPlateTags(plate) {
            var deffered = $q.defer();
            var tags = [];
            var plateId = plate.$id;

            var query = fb.child('plate_tags/' + plateId + '/tags');
            $firebaseArray(query).$loaded().then(dataService.initArray).then(function(tagIds) {

                if (tagIds.length === 0) {
                    deffered.resolve(tags);
                }
                angular.forEach(tagIds, function(value, key) {
                    var query = fb.child('tags/' + value.guid);
                    $firebaseObject(query).$loaded().then(dataService.initItem).then(function(tag) {
                        tags.push(tag);
                        if (tags.length === _.size(tagIds)) {
                            deffered.resolve(tags);
                        }
                    });
                });
            });
            return deffered.promise;
        }
    }
})();
