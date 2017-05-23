(function () {
    'use strict';

    angular
        .module('starter.home')
        .factory('homeService', homeService);

    homeService.$inject = ['_', 'EventEmitterService', 'chefsService', 'plateService', 'categoryService', 'dataService', 'tagsService'];

    function homeService(_, EventEmitterService, chefsService, plateService, categoryService, dataService, tagsService) {
        var service = {};
        angular.extend(service, new EventEmitterService);

        var filter = function (chefList, plateList) {
            var plateListWithUndefined = _.map(plateList, function (plate) {
                if (_.contains(chefList, plate.chef)) return plate;
            });
            return _.filter(plateListWithUndefined, function (plate) {return plate ? true : false});
        };

        var getOnlineChefsAndFilter = function(plates) {
            return chefsService.onlines().then(function(onlineChefs){
                var guidList = _.map(onlineChefs, function(chef) { return chef.guid });
                return filter(guidList, plates);
            });
        };

        var fetch = function () {
            return plateService.fromCategory(categoryService.getCurrent().guid)
                .then(getOnlineChefsAndFilter)
                .then(dataService.populate('chef', {nodeName: 'chefs'}))
                .then(chefsService.populateLabors)
                .then(tagsService.populate)
                .then(plateService.spliceFeatured);
        };

        service.fetch = fetch;
        service.getOnlineChefsAndFilter = getOnlineChefsAndFilter;
        return service;
    }
})();
