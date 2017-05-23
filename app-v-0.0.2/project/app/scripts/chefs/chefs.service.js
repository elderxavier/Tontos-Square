(function() {
	'use strict';

	angular
		.module('starter.chefs')
		.factory('chefsService', chefsService);

	chefsService.$inject = ['dataService', '$firebaseObject', '$firebaseArray', 'fb', '$q', 'plateService', '_', 'LaborClassService', 'periodsService', 'locationService', 'DateClassService'];
    
    var WeekDateToNumber = {
        "sunday": 0,
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6
    }
    
	/* @ngInject */
	function chefsService(dataService, $firebaseObject, $firebaseArray, fb, $q, plateService, _, LaborClassService, periodsService, locationService, DateClassService) {
		var service = {
			getChefs: getChefs,
			getChefById: getChefById,
            onlines: onlines,
            getFeaturedChefs: getFeaturedChefs,
            populateLabors: populateLabors,
            getOnlineChefs: getOnlineChefs
            //chefsInLocation:  chefsInLocation
		};
		return service;

		// ******************************************************************

		function getChefs() {
			var query = fb.child('chefs');
			return $firebaseArray(query).$loaded().then(dataService.initArray);
		};

		function getChefById(id) {
			var query = fb.child('chefs/' + id);
			return $firebaseObject(query).$loaded().then(dataService.initItem);
		};

        function onlines() {
            var query = fb.child('online_chefs');
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        };

        function getOnlineChefs() {
            var chefs = [];

            return onlines().then(function (onlineChefs) {
                angular.forEach(onlineChefs, function(onlineChef) {
                    chefs.push(getChefById(onlineChef.$id).then(function (chef) {
                        return chef;
                    }));
                });
                return $q.all(chefs);
            });
        };

        function populateLabors(plates) {
            var chefs = _.map(plates, function(plate) { return plate.chef });
            chefs = _.uniq(chefs);

            return periodsService.load().then(function(rescuedPeriods) {
                angular.forEach(chefs, function(chef) {
                    chef.labors = [];
                    angular.forEach(chef.working_periods, function(periods, day){
                        var chefLaborPeriods = [];
                        angular.forEach(periods.periods, function(value, period) {
                            var rescuedPeriod = _.find(rescuedPeriods, function(_period) { return _period.guid === period})
                            if(_.find(rescuedPeriods, function(_period) { return _period.guid === period}))
                                chefLaborPeriods.push(rescuedPeriod);
                        });
                        var chefLaborDate = new DateClassService();
                        chefLaborDate.next(WeekDateToNumber[day]);
                        chef.labors.push(new LaborClassService(chefLaborDate, chefLaborPeriods));
                    });
                 });
                return plates;
            });
        };

        function getFeaturedChefs() {
            var query = fb.child('chefs').orderByChild('isFeatured').equalTo(true);
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(function(featuredChefs){
                var deffered = $q.defer();
                var chefsWithFeaturedPlates = [];

                angular.forEach(featuredChefs, function(chef, index){
                    plateService.getPlatesOrderRatingByChef(chef.$id).then(function(plates){
                        chef.plates = plates;
                        chefsWithFeaturedPlates.push(chef);
                        if (featuredChefs.length === _.size(chefsWithFeaturedPlates)) {
                            deffered.resolve(chefsWithFeaturedPlates);
                        }
                    })
                });

                return deffered.promise;
            });
        };

        /*function chefsInLocation(chefs) {
                var valids = [];
                var locationObj = {
                        lat: locationService.getMarkerPositionLatitude(),
                        long: locationService.getMarkerPositionLongitude()
                };
                chefs.forEach(function(chef, index){
                    if(chef.currentAddress){
                        var currentAddress = chefs[index].currentAddress;
                        var query = fb.child('addresses/' + currentAddress);
                        $firebaseObject(query).$loaded().then(function(address){
                                var orig = new google.maps.LatLng(locationObj.lat, locationObj.long);
                                var dest = address.locality + ', ' + address.street + ' - ' + address.state;
                                var dmService = new google.maps.DistanceMatrixService();
                                dmService.getDistanceMatrix({
                                        origins: [orig],
                                        destinations: [dest],
                                        travelMode: google.maps.TravelMode.DRIVING
                                }, cb);
                                function cb(response, status){

                                      var distance = response.rows[0].elements[0].distance.value;
                                      if(distance <= 10000) valids.push(chef);
                                      return;
                                }
                        });
                    }
                    return;
                });

              return valids;
        } */
	}
})();
