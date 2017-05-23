(function () {
	'use strict';

	angular
		.module('starter.profile')
		.factory('profileService', profileService);

	profileService.$inject = [
        'dataService',
        'fb',
        '$q',
        'imageService'];

	/* @ngInject */
	function profileService(
        dataService,
        fb,
        $q,
        imageService) {
		var service = {
			getModuleName: getModuleName,
			getUserAddresses: getUserAddresses,
			setUser: setUser
		};
		return service;

		// ***************************************************************

		function getModuleName() {
			return 'Profile';
		}

		function getUserAddresses(addresses) {
			if (addresses) {
				return getAddresses(addresses);
			}

			return;
		}

		function setUser(user) {
			var userRef = fb.child('users/' + user.$id);
			if (user.fullPath === user.photoURL) {
				return userRef.update({
					displayName: user.displayName,
					phone: user.phone,
					birthday: user.birthday
				}).catch(function (error) {
					console.log('Update failed: ' + error.message);
					throw error;
				});
			} else {
				return imageService.uploadImage(user.filename, user.fullPath, user.$id).then(function () {
					return userRef.update({
						displayName: user.displayName,
						phone: user.phone
					}).catch(function (error) {
						console.log('Update failed: ' + error.message);
						throw error;
					});
				})
			}
		}

		//Private

		function getAddress(addressId) {
			var addressRef = fb.child('addresses/' + addressId);
			return addressRef.once('value')
				.then(function (snapshot) {
					var address = snapshot.val();
					address.$id = addressId;

					return address;
				});
		}

		function getAddresses(addressesObj) {
			return $q(function (resolve, reject) {
				var counter = 0;
				var keys = getKeys(addressesObj);
				var addresses = [];

				function next(address) {
					if (counter < keys.length) {
						getAddress(keys[counter++]).then(next);
					} else {
						resolve(addresses);
					}
					if (address) {
						addresses.push(address);
					}
				}

				next();
			});
		}

		function getKeys(objectCollection) {
			var keys = [];
			angular.forEach(objectCollection, function (value, key) {
				keys.push(key);
			});
			return keys;
		}

	}

})();
