(function() {
    'use strict';

    angular
        .module('starter')
        .controller('ReviewController', ReviewController);

    ReviewController.$inject = [
        '$scope',
        '$rootScope',
        'reviewService',
        'plateService',
        'fb',
        '$ionicModal',
        '$firebaseArray',
        '$firebaseObject',
        '$firebaseAuth',
        'chefsService',
        'ngDialog'
    ];

    /* @ngInject */
    function ReviewController(
        $scope,
        $rootScope,
        reviewService,
        plateService,
        fb,
        $ionicModal,
        $firebaseArray,
        $firebaseObject,
        $firebaseAuth,
        chefsService,
        ngDialog) {

        var reviewId = "";
        var userId = "";
        var pendingReview;
        var review;

        $scope.rating = {};
        $scope.rating.rate = 0;
        $scope.rating.max = 5;

        $rootScope.$on('createReview', function(event, order) {
            createReview(order);
        });

        function createReview(order) {
            var query = fb.child('reviews/' + order.review.$id);
            review = $firebaseObject(query);
            $scope.chefName = order.chef.name;
            $scope.chefThumb = order.chef.thumb;

            showModal();
        }

        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                userId = firebaseUser.uid;
                var query = fb.child('user_pending_reviews/' + userId + '/reviews');
                $firebaseArray(query).$watch(function(data) {
                    if (data.event === 'child_added') {
                        reviewId = data.key;
                        pendingReview = data;
                        reviewService.getReviewById(reviewId).then(function(reviewObj) {
                            //console.log("plate on review " + reviewObj.plate);
                            review = reviewObj;
                            plateService.getPlateById(review.plate).then(function(plate) {
                                //console.log("chef on plate " + plate.chef);
                                chefsService.getChefById(plate.chef).then(function(chef) {
                                    // console.log("chef email " + chef.email);
                                    $scope.chefName = chef.name;
                                    $scope.chefThumb = chef.thumb;
                                });
                            });
                        });
                        showModal();
                    }
                });
            }

        });

        function showModal() {
            ngDialog.open({
                template: 'scripts/reviews/review.html',
                scope: $scope,
                className: 'ngdialog-theme-default register-popup'
            });
        }

        $scope.openModal = function() {
            ngDialog.close();
            // $scope.modal.show();
        };

        $scope.closeModal = function() {
            // $scope.modal.hide();
            if (pendingReview) {
                reviewService.removePendingReview(pendingReview, userId);
            }

            review.pending = false;
            reviewService.updateReview(review);
            ngDialog.close();
        };

        $scope.SendReview = function(rev) {
            review.comment = rev;
            review.rating = $scope.rating.rate;
            review.timestamp = moment().unix();
            reviewService.updateReview(review);
            $scope.closeModal();

            $scope.rating.rate = 0;
            $scope.comment = "";
        };

        $scope.Report = function() {

        }
    }
})();
