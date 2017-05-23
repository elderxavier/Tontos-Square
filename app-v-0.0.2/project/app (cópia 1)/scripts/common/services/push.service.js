(function () {
	'use strict';

	angular
		.module('starter.common')
		.factory('pushService', pushService);

	pushService.$inject = ['$window', '$http', 'ENV'];

	/* @ngInject */
	function pushService($window, $http, ENV) {
		var instance = {
			isAvailable: isAvailable,
			setup: setup,
			setUser: setUser,
			setSubscription: setSubscription,
			sendMessage: sendMessage,
		};

		return instance;

		// ****************************************************************

		function isAvailable() {
			return !!($window.plugins && $window.plugins.OneSignal);
		}

		/**
		 * Executa sempre que uma notificação é aberta pelo usuário
		 * @see https://documentation.onesignal.com/docs/ionic-sdk#section--handlenotificationopened-
		 * @param data Conteúdo da notificação
		 */
		function handleNotificationOpened(data) {
			console.log('should handle notification opened...', data);
		}

		/**
		 * Executa sempre que uma notificação é recebida
		 * @see https://documentation.onesignal.com/docs/ionic-sdk#section--handlenotificationreceived-
		 * @param data Conteúdo da notificação
		 */
		function handleNotificationReceived(data) {
			console.log('should handle notification received...', data);
		}

		function setup() {
			if (!isAvailable()) return;

			// TODO: Verificar se o valor esperado para o GoogleAppId é o mesmo do GCM_ID
			$window.plugins.OneSignal
				.startInit(ENV.onesignalAppId, ENV.gcmId)
				.handleNotificationOpened(handleNotificationOpened)
				.handleNotificationReceived(handleNotificationReceived)
				.endInit();
		}

		function setUser(email) {
			if (!isAvailable()) return;
			$window.plugins.OneSignal.syncHashedEmail(email);
		}

		function setSubscription(enabled) {
			if (!isAvailable()) return;
			$window.plugins.OneSignal.setSubscription(enabled);
		}

		function sendMessage(email, title, message, options) {
			return $http.post(ENV.baseUrl + '/api/push/email', {
				to: email,
				title: title,
				message: message,
				config: options,
			});
		}

	}
})();
