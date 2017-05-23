(function() {
    'use strict';

    angular.module('starter.auth', ['ionic',
        'ngCordova',
        'starter.common'
    ]).factory('ngFB', function($q, $window) {

        function init(params) {
            if ($window && $window.openFB) {
                return $window.openFB.init(params);
            }
        }

        function login(options) {
            var deferred = $q.defer();
            $window.openFB.login(function(result) {
                if (result.status === "connected") {
                    deferred.resolve(result);
                } else {
                    deferred.reject(result);
                }
            }, options);
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            $window.openFB.logout(function() {
                deferred.resolve();
            });
            return deferred.promise;
        }

        function api(obj) {
            var deferred = $q.defer();
            obj.success = function(result) {
                deferred.resolve(result);
            };
            obj.error = function(error) {
                deferred.reject(error);
            };
            $window.openFB.api(obj);
            return deferred.promise;
        }

        function revokePermissions() {
            var deferred = $q.defer();
            $window.openFB.revokePermissions(
                function() {
                    deferred.resolve();
                },
                function() {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function getLoginStatus() {
            var deferred = $q.defer();
            $window.openFB.getLoginStatus(
                function(result) {
                    deferred.resolve(result);
                }
            );
            return deferred.promise;
        }

        return {
            init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            getLoginStatus: getLoginStatus
        };

    });
})();
