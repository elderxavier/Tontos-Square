(function () {

    var app = angular.module('simple-tabs', ['ionic']);

    app.directive('simpleTabs', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
        return {
            restrict: 'E',
            replace: false,
            template: '<div class="st-tabs st-tabs--light has-header"><ion-scroll direction="x" class="st-scroll" delegate-handle="{{delegateHandle}}"><div class="st-tabs__body"><ng-transclude></ng-transclude></ion-scroll></div></div>',
            transclude: true,
            scope: {
                delegateHandle: '@'
            },
            link: function(scope, element, attributes) {
                element.on("click", function($event) {
                    var centerPosition = ($event.target.offsetLeft - (document.documentElement.clientWidth / 2)) + ($event.target.offsetWidth / 2);
                    $ionicScrollDelegate.$getByHandle(scope.delegateHandle).scrollTo(centerPosition, 0, true);
                });
            }
        }
    }]);

    app.directive('stTab', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<a class="st-tabs__item"><ng-transclude></ng-transclude></a>',
            transclude: true,
            link: function (scope, element, attributes) {
                element.on("click", function ($event) {
                    angular.forEach(element.parent().children(), function (_element) {
                        angular.element(_element).removeClass('selected');
                    });

                    element.addClass('selected');
                });
            }
        }
    });

})();
