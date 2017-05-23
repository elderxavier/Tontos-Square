(function() {
    'use strict';

    angular
        .module('starter.reviews')
        .factory('reviewService', reviewService);

    reviewService.$inject = ['dataService', 'fb', '$firebaseArray', '$firebaseObject', '$q', '_'];

    /* @ngInject */
    function reviewService(dataService, fb, $firebaseArray, $firebaseObject, $q, _) {
        var service = {
            getReviewById: getReviewById,
            getAllReviews: getAllReviews,
            getPlateReviews: getPlateReviews,
            getUserPendingReviews: getUserPendingReviews,
            removePendingReview: removePendingReview,
            updateReview: updateReview
        };
        return service;

        function getReviewById(reviewID) {
            var query = fb.child('/reviews/' + reviewID);
            return $firebaseObject(query).$loaded();
        }

        function getAllReviews() {
            var query = fb.child('reviews/');
            return $firebaseArray(query).$loaded().then(dataService.initArray);
        }

        //returns only not pending reviews for the plate
        function getPlateReviews(plate) {
            var deffered = $q.defer();
            var reviews = [];
            var plateId = plate.$id;
            var query = fb.child('plate_reviews/' + plateId + '/reviews');

            $firebaseArray(query).$loaded().then(dataService.initArray).then(function(reviewIds) {
                if (reviewIds.length === 0) {
                    deffered.resolve(reviews);
                }
                angular.forEach(reviewIds, function(value, key) {
                    var query = fb.child('reviews/' + value.guid);
                    $firebaseObject(query).$loaded().then(dataService.initItem).then(function(review) {
                        var query = fb.child('users/' + review.user);
                        $firebaseObject(query).$loaded().then(dataService.initItem).then(function(user) {
                            review.user = user;
                            reviews.push(review);
                            if (reviews.length === _.size(reviewIds)) {
                                var notPendingReviews = _.filter(reviews, function(review){ return !review.pending});
                                deffered.resolve(notPendingReviews);
                            }
                        });
                    });
                });
            });
            return deffered.promise;
        }

        function getUserPendingReviews(user) {
            var deffered = $q.defer();
            var reviews = [];
            var userId = user.$id;

            var query = fb.child('user_pending_reviews/' + userId + '/reviews');
            $firebaseArray(query).$loaded().then(dataService.initArray).then(function(reviewIds) {

                if (reviewIds.length === 0) {
                    deffered.resolve(reviews);
                }
                angular.forEach(reviewIds, function(value, key) {
                    var query = fb.child('reviews/' + value.guid);
                    $firebaseObject(query).$loaded().then(dataService.initItem).then(function(reviews) {
                        var query = fb.child('users/' + reviews.user);
                        $firebaseObject(query).$loaded().then(dataService.initItem).then(function(user) {
                            reviews.user = user;
                            reviews.push(reviews);
                            if (reviews.length === _.size(reviewsIds)) {
                                deffered.resolve(reviews);
                            }

                        });
                    });
                });
            });
            return deffered.promise;
        }

        function removePendingReview(pendingReview, userId){
            var query = fb.child('user_pending_reviews/' + userId + '/reviews/' + pendingReview.key);
            $firebaseObject(query).$remove();
        }

        function updateReview(review){
            review.$save();
        }
    }
})();
