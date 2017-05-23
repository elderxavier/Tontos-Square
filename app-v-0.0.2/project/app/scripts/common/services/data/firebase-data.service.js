(function() {
    'use strict';

    angular
        .module('starter.common')
        .factory('firebaseDataService', firebaseDataService)
        .factory('firebaseStorageService', firebaseStorageService)
        .factory("fb", function() {
            var config = {

                //dev
                apiKey: "AIzaSyCHqDMwzWm3JlUMZAAvhnY_7F6mvjg4mjE",
                authDomain: "eater-c5904.firebaseapp.com",
                databaseURL: "eater-c5904.firebaseio.com",
                storageBucket: 'gs://eater-c5904.appspot.com'

                //prod
                /*apiKey: "AIzaSyBl3FhRDZuoWysJII3QEBBDoIw4aE_GmWg",
                authDomain: "interaxa-ec81f.firebaseapp.com",
                databaseURL: "https://interaxa-ec81f.firebaseio.com"*/


                //eater-test
                //apiKey: "DZUcnTOOdEdZNvPAzlm3tCiOelcdl3Fx6Sxgz6XS",
                //authDomain: "eater-test.firebaseapp.com",
                //databaseURL: "eater-test.firebaseio.com"
            };

            if (firebase.apps.length === 0) {
                firebase.initializeApp(config);
            }
            return firebase.database().ref();
        });

    firebaseStorageService.$inject = ['_', 'fb'];


    function firebaseStorageService(_, fb) {
        return firebase.storage().ref();
    }

    firebaseDataService.$inject = ['_', 'fb', '$firebaseArray', '$firebaseObject', '$q', 'asyncService'];


    /* @ngInject */
    function firebaseDataService(_, fb, $firebaseArray, $firebaseObject, $q, asyncService) {
        var service = {
            initItem: initItem,
            initArray: initArray,
            resolve: resolve,
            populate: populate,
            getGuids: getGuids,
            getSettings: getSettings,
        };
        return service;

        // ***********************************************************

        function initItem(item) {
            return angular.extend({}, item, {
                guid: item.$id
            });
        }

        function initArray(array) {
            return _.map(array, initItem);
        }

        function getListOf(property, list) {
            return _.map(list, function(item) {
                return item[property];
            });
        }

        function getGuids(plates) {
            return _.map(plates, function(plate) {
                return plate.guid;
            });
        }

        function _populate(entity, options, list) {
            return _resolveArray(options.nodeName, getListOf(entity, list)).then(function(entityList) {
                angular.forEach(list, function(item) {
                    item[entity] = _.find(entityList, function(entityItem) {
                        return entityItem.guid === item[entity];
                    });
                });
                return list;
            });
        }

        function populate(entity, options) {
            return _populate.bind({}, entity, options);
        }

        function _resolveArray(entity, idList) {
            var list = [];
            var deffered = $q.defer();

            asyncService.iterate(idList, function(itemId, next) {
                var ref = fb.child(entity + '/' + itemId);
                var obj = $firebaseObject(ref);
                obj.$loaded().then(function() {
                    list.push(initItem(obj));
                    next();
                });
            }, function() {
                deffered.resolve(list)
            });

            return deffered.promise;
        }

        function resolve(entity) {
            return {
                fromList: _resolveArray.bind({}, entity)
            }
        }

        function getSettings() {
            var query = fb.child('/settings');
            return $firebaseObject(query);
        }
    }
})();
