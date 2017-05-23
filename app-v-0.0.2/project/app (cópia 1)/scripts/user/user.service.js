(function() {
	'use strict';

	angular
		.module('starter.user')
		.factory('userService', userService);

	userService.$inject = ['dataService', '$firebaseObject', '$firebaseArray', 'fb', '$q'];

	/* @ngInject */
	function userService(dataService, $firebaseObject, $firebaseArray, fb, $q) {
		var service = {
			getUsers: getUsers,
			getUserById: getUserById,
            update: update 
		};
		return service;

		// ******************************************************************

		function getUsers() {
			var query = fb.child('users');
			return $firebaseArray(query).$loaded().then(dataService.initArray);
		}

		function getUserById(id) {
			var query = fb.child('users/' + id);
			return $firebaseObject(query).$loaded().then(dataService.initItem);
		}
        
        function update(user, key) {
            var updates = {};
            updates['users/' + user.$id + '/' + key] = user[key];
            return fb.update(updates); 
        }
	}
})();
