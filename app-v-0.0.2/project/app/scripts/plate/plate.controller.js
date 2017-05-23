(function() {
    'use strict';
    angular
        .module('starter.plate')
        .controller('PlateController', PlateController);

    PlateController.$inject = ['$scope', 'plateService', 'plate', 'restaurantCartService', 'ionicToast', '$state', 'category', 'tags', 'chef', 'reviews', 'fb', 'laborModalService', 'labor'];

    function PlateController($scope, plateService, plate, restaurantCartService, ionicToast, $state, category, tags, chef, reviews, fb, laborModalService, labor) {
        var plate = _.clone(plate);
        var category = _.clone(category);


        var vm = angular.extend(this, {
            plate: plate,
            tags: tags,
            chef: chef,
            reviews: reviews,
            category: category,
            next: next,
            showCart: showCart,
            isAtHand: isAtHand,
            showChefDetails:showChefDetails,
            getPeriod: getPeriod,
            closeModal: closeModal
        });

        function next() {
            var plate = vm.plate;
            if (isAtHand()) {
                restaurantCartService.addToCart(plate, 1);
                showCart();
            } else {
                laborModalService.setCheckoutMode(plate);
                laborModalService.modal.open();
            }
        }
        function showChefDetails(id) {
            $state.go('app.chefdetail', {
                chefId: id
            });

        }
        function showCart() {
            $state.go('app.restaurant-cart');
        }

        //true se for pronta entrega false se for schedule..
        function isAtHand() {
            return labor.matchWithAny(vm.chef.labors);
        }

        // retorna periodo selecionado no header da home (DIA - PERÍODO)
        function getPeriod(){
            return (labor.date.alias + ' - ' + labor.periods[0].alias).toUpperCase();
        }

        function closeModal(){
            laborModalService.modal.close();
            $state.go('app.home');
        }
    }
})();
