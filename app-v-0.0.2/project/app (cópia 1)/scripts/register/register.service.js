(function () {
	'use strict';

	angular
		.module('starter.first-interaction')
		.factory('registerService', registerService);

	registerService.$inject = [
		'authService',
		'fb',
		'$q',
		'imageService',
		'$rootScope',
		'$firebaseArray',
		'dataService',
		'popupService'
	];

	/* @ngInject */
	function registerService(
		authService,
		fb,
		$q,
		imageService,
		$rootScope,
		$firebaseArray,
		dataService,
		popupService
	) {
		var service = {
			emailCheck: emailCheck
		};
		return service;

		function emailCheck(email) {
			console.log('emailcheck')
			var users = fb.child('users');
			$firebaseArray(users).$loaded().then(dataService.initArray).then(function (data) {
				angular.forEach(data, function (value, key) {
					if (value.email === email) {
						popupService.open('Erro', "O e-mail <div style='font-style: italic'>" + value.email + "</div> já existe em nossa base de dados");
					}
				});
			});
		}

	}
})();
