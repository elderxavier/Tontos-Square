(function () {
	'use strict';

	angular
		.module('starter.image')
		.factory('imageService', imageService);

	imageService.$inject = ['$cordovaCamera',
		'firebaseStorageService',
		'$rootScope',
		'fb',
		'$firebaseObject',
		'$q'
	];

	function imageService($cordovaCamera,
		firebaseStorageService,
		$rootScope,
		fb,
		$firebaseObject,
		$q) {

		var service = {
			getImage: getImage,
			uploadImage: uploadImage
		};
		return service;

		function options(params) {
			return {
				sourceType: params,
				// destinationType: Camera.DestinationType.DATA_URL,
				destinationType: Camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				quality: 100,
				targetWidth: 640,
				targetHeight: 640,
				saveToPhotoAlbum: true,
				// allowEdit: true,
				correctOrientation: true
			};
		}

		// plugins.crop(onSuccess, onFail, path, options)

		/**
		 *  Esta função recebe um inteiro como opção de uso, câmera ou galeria -veja constantes no image.module-,
		 *  e retorna uma promise, contendo o caminho da foto e o nome do arquivo. 
		 * 
		 * @param {int} source
		 * @returns {promise} temp ( object: { {string} fullPath, {string} filename} )
		 */
		function getImage(source) {
			var q = $q.defer();

			var filename = '';
			var temp = {};

			if (source === 0) {
				navigator.camera.getPicture(onSuccess, onFail, options(Camera.PictureSourceType.CAMERA));
			} else {
				navigator.camera.getPicture(onSuccess, onFail, options(Camera.PictureSourceType.SAVEDPHOTOALBUM));
			}

			/** 
			 * Esta função é chamada quando há sucesso no retorno da escolha da foto.
			 * Ela recebe uma string que contém o caminho da foto, cria o nome do arquivo, abre a janela para a edição da foto,
			 * e prepara o objeto 'temp' para o seu retorno, contendo o nome do arquivo e o caminho da imagem.
			 * 
			 * @param {string} data
			 */
			function onSuccess(data) {
				filename = data.replace(/^.*[\\\/]/, '');
				/**
				 * A janela de edição é aberta usando o plugin cordova-plugin-crop, conforme abaixo.
				 * Ao receber uma string como caminho da imagem e um objeto contendo a qualidade, ele cria e prepara o objeto temp
				 * para ser retornado, quando acabar a sua execução de sucesso. 
				 * 
				 * @param {function} success
				 * @param {function} fail
				 * @param {string} path
				 * @param {object: { {int} quality } } options
				 */
				plugins.crop(function success(data) {
					temp.fullPath = data;
					temp.filename = filename;
					q.resolve(temp);
				}, function fail(error) {
					console.log(error);
					q.reject(error);
				}, data, {
					quality: 100
				});
			}

			/**
			 * Esta função é chamada quando a escolha da imagem retorna uma falha.
			 * 
			 * @param {any} error
			 */
			function onFail(error) {
				console.log(error);
				q.reject(error);
			}

			return q.promise;

		}

		/**
		 * Esta função é responável por fazer o upload da imagem, ela receberá o nome da imagem, o caminho,
		 * ID de referência do Firebase e o index de referência.
		 * 
		 * @param {string} name
		 * @param {string} path
		 * @returns
		 */
		function uploadImage(name, path, id) {
			var q = $q.defer();
			var firebaseRef = fb.child('users/' + id + '/photoURL');
			var tempObject = $firebaseObject(firebaseRef);


			var storageRef = firebaseStorageService;

			var getFileBlob = function (url, cb) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'blob';
				xhr.addEventListener('load', function () {
					cb(xhr.response);
				});
				xhr.send();
			};

			var blobToFile = function (blob, name) {
				blob.lastModifiedDate = new Date();
				blob.name = name;
				return blob;
			};

			var getFileObject = function (filePathOrUrl, cb) {
				getFileBlob(filePathOrUrl, function (blob) {
					cb(blobToFile(blob, name));
				});
			};

			getFileObject(path, function (fileObject) {
				var uploadTask = storageRef.child('images/user/' + $rootScope.currentUser.uid + '/photo/' + name).put(fileObject);


				uploadTask.on('state_changed', function (snapshot) {}, function (error) {
					console.log(error);
					q.reject(error);
				}, function () {
					console.log("opa 2");
					var downloadURL = uploadTask.snapshot.downloadURL;
					tempObject.$value = downloadURL;
					tempObject.$save().then(function () {
						console.log('Deu certo');
						q.resolve('Deu certo');
					})
				});
			});

			return q.promise;
		}

	}

})();
