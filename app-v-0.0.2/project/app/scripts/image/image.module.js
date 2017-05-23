(function() {
	'use strict';

	angular
		.module('starter.image', [
			'ionic',
			'ngCordova',
			'starter.common'
		])
		
		/**
		 * Constantes:
		 * CAMERA - representa a câmera do dispositivo
		 * GALLERY - representa a galeria do dispositivo
		 * PLATE - index que representa a foto do prato
		 * CHEFTHUMB - index que representa a foto do chef
		 * SPECIALITYTHUMB - index que representa a foto da especialidade
		*/
		.constant('IMAGE', {
			CAMERA: 0,
			GALLERY: 1
		});
})();
