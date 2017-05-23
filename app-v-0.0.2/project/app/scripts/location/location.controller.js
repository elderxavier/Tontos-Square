(function() {
    'use strict';
    angular
        .module('starter.location')
        .controller('LocationController', LocationController);

    LocationController.$inject = ['$state','dataService','$ionicModal','userAddresses','$rootScope', 'locationService', '$ionicTabsDelegate', '$timeout', '$scope', 'popupService','addressConfirmationService'];

    /* @ngInject */
    function LocationController($state,dataService,$ionicModal,userAddresses,$rootScope, locationService, $ionicTabsDelegate, $timeout, $scope, popupService,addressConfirmationService) {
		//Models
		var reverseGeoCode;
        $scope.currentView = 'location';

        var vm = angular.extend(this, {
            cep: '',
            currentUser:$rootScope.currentUser !=null,
            autoProgress:autoProgress,
            manualInput:manualInput,
            updateLocation: locationService.updateLocation,
            confirmLocation: function() {
				var comps = reverseGeoCode.address_components;
				var city = findComponent(comps, 'locality') || findComponent(comps, 'administrative_area_level_2');
                var state = findComponent(comps, 'administrative_area_level_1', 'short_name');

                    locationService.validateCity(city).then( function(isValidCity) {
                        if(isValidCity) {
                            
                        } else {
                            locationService.validateState(state).then( function(isValidState){
                                if(isValidState){
                                    
                                } else {
                                    popupService.open('Ops!', 'O Eater não está disponível em sua região<br>=(');
                                }
                            })
                        }
                    });
                locationService.confirmLocation;
            },
            findLocation: findLocation,
            isGpsOn: locationService.isGpsOn,
            isConfirmed: locationService.isConfirmed,
            getPosition: locationService.getPosition,
            getCenterPositionLatitude: locationService.getCenterPositionLatitude,
            getCenterPositionLongitude: locationService.getCenterPositionLongitude,
            getMarkerPositionLatitude: locationService.getMarkerPositionLatitude,
            getMarkerPositionLongitude: locationService.getMarkerPositionLongitude,
            goToSettings: goToSettings,
            getAddress:getAddress
        });

        $scope.demoCaption2 = "This is demoing the second classic transparency walk-through.\nit has a caption, " +
                              "regular marking of DOM element";
      loadModal();




  		locationService.reverseGeoCode().then(function(result) {
  				reverseGeoCode = result;
				  $scope.showReverseGeo = result.address_components[1].short_name+','+result.address_components[0].short_name;
        vm.address=result.address_components[1].short_name+','+result.address_components[0].short_name;
			});

        // $scope.$on( "$ionicView.enter", function( scopes, states ) {
        // 	locationService.getPosition();
        // });

        $scope.hideBackButton = locationService.backButton.hide;

        $scope.userAddresses = userAddresses;


        function loadModal() {
            $scope.cur=vm.address;
            $ionicModal.fromTemplateUrl('scripts/address-confirmation/add-address/add-address.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                })
                .then(function(modal) {
                    $scope.modal = modal;
                });
        }

        function goToSettings() {
            cordova.plugins.settings.open(function() {
                    console.log('open settings');
                },
                function(error) {
                    console.log('error: ' + error);
                });
        }

        function findLocation(){
            locationService.validateCep(vm.cep).then(function(valid) {
                        if (valid) {
                            $state.go('app.home');
                        }
                    });
    }

        function manualInput(){
               $scope.modal.show();
      }
      function getAddress(){
               return vm.address;
      }

       function autoProgress(cep){
            if (cep !== undefined){
                findLocation()
            }
        }


		function findComponent(components, type, attr) {
			attr = attr || 'long_name';
			var n, m;
			n = components.length;
			while (n--) {
				var componentTypes = components[n].types;
				m = componentTypes.length;
				while (m--) {
					if (componentTypes[m] === type) {
						return components[n][attr || 'long_name'];
					}
				}
			}

			return null;
		}

    }
})();
