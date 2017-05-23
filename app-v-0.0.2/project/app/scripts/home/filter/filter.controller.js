(function() {
    'use strict';
    angular
        .module('starter.home.filter')
        .controller('FilterController', FilterController);

    FilterController.$inject = [
        '$scope',
        'filterService',
        'tagsService',
        'homeService',
        '$ionicLoading',
        '_'];

    function FilterController(
        $scope,
        filterService,
        tagsService,
        homeService,
        $ionicLoading,
        _) {

        var vm = angular.extend(this, {
            filter: filterService.filter,
            close:filterService.close,
            tags: [],
            getMaxMin: getMaxMin,
            getMaxMax: getMaxMax,
            cleanFilter: filterService.cleanFilter,
            applyFilter: applyFilter,
            updateMaxPrice: filterService.updateMaxPrice,
            isChecked: isChecked,
            updateTag: updateTag,
            rzGetOptions: rzGetOptions
        });

        tagsService.getAllTags().then(function(tags){
            vm.tags = tags;
        });

        function rzGetOptions() {
            return {
                floor: getMaxMin(),
                ceil: getMaxMax(),
                showSelectionBar: true,
                getSelectionBarColor: function() { return '#D93C4F'; },
                translate: function(value) { return 'R$ ' + value + ',00'; }
            }
        }

        function getMaxMin() {
            return 1 + parseInt(vm.filter.price.min);
        }

        function getMaxMax() {
            return 150 + parseInt(vm.filter.price.min);
        }

        function applyPriceFilter(plates) {
            plates.featured = _.filter(plates.featured, function(plate) {
                return plate.price <= vm.filter.price.current;
            });

            plates.normal = _.filter(plates.normal, function(plate) {
               return plate.price <= vm.filter.price.current;
            });
        }

        function applyTagsFilter(plates) {
             plates.featured = _.filter(plates.featured, function(plate) {
                var match = true;

                angular.forEach(vm.filter.tags, function(tag) {
                    var tagMatch = _.find(plate.tags, function(plateTag) {
                       return tag.guid === plateTag.guid;
                    });

                    if(!tagMatch) match = false;
                });

                return match;
            });

            plates.normal = _.filter(plates.normal, function(plate) {
                var match = true;

                angular.forEach(vm.filter.tags, function(tag) {
                    var tagMatch = _.find(plate.tags, function(plateTag) {
                       return tag.guid === plateTag.guid;
                    });

                    if(!tagMatch) match = false;
                });

                return match;
            });
        }

        function applyFilter() {
            $ionicLoading.show();
            homeService.fetch().then(function(plates){
                applyPriceFilter(plates);
                applyTagsFilter(plates);

                homeService.emit('plates', [plates]);

                $ionicLoading.hide();
            });

            filterService.close();
        }

        function isChecked(tag) {
            var match = _.find(vm.filter.tags, function(_tag) {
               return _tag.guid === tag.guid;
            });

            return match;
        }

        function updateTag(tag) {
            var checkedTag = isChecked(tag);

            if (!checkedTag) {
                vm.filter.tags.push(tag);
            } else {
                var _index = vm.filter.tags.indexOf(checkedTag);
                vm.filter.tags.splice(_index, 1);
            }
        }

        $scope.close = filterService.close;
    }
})();
