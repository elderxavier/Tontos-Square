(function () {
    'use strict';

    angular
        .module('starter.home.filter')
        .factory('filterService', filterService);

    filterService.$inject = [
        'dataService',
        'firebaseDataService',
        'fb',
        '$firebaseObject',
        '$firebaseArray',
        '$ionicModal',
        'ngDialog'];

    /* @ngInject */
    function filterService(
        dataService,
        firebaseDataService,
        fb,
        $firebaseObject,
        $firebaseArray,
        $ionicModal,
        ngDialog) {

        var filterModal = undefined;
        var filter = {
            active: false,
            price: {
                min: 0,
                max: 151,
                current: 75
            },
            tags: [],
            rating: 0
        };

        var init = function (scope) {
            return $ionicModal.fromTemplateUrl('scripts/home/filter/filter.html', {
                    scope: scope,
                    animation: 'slide-in-up'
                })
                .then(function (modal) {
                    filterModal = modal;
                });
        };

        /*var open = function (scope) {
            ngDialog.open({
                template: 'scripts/home/filter/filter.html',
                scope: scope,
                className: 'ngdialog-theme-default register-popup'
            });
            /!*if(filterModal)
                filterModal.show();*!/
        };

        var close = function () {
            ngDialog.close();
            /!*if(filterModal)
                filterModal.hide();*!/
        };*/

        var service = {
            active: false,
            cleanFilter: cleanFilter,
            updateMaxPrice: updateMaxPrice,
            filter: filter,
            open: open,
            close: close,
            init: init
        };
        return service;

		function open (scope) {
			/*ngDialog.open({
				template: 'scripts/home/filter/filter.html',
				scope: scope,
				className: 'ngdialog-theme-default register-popup'
			});*/


			if(filterModal)
			 filterModal.show();
		}
		function close () {
			//ngDialog.close();
			if(filterModal)
			 filterModal.hide();
		}


        function cleanFilter() {
            filter.active = false;
            filter.price.min = 1;
            filter.price.max = 151;
            filter.tags = [];
            filter.rating = 0;
        }

        function updateMaxPrice() {
            filter.price.max = parseInt(filter.price.min) + 1;
        }
    }

})();
