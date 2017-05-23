(function () {
    'use strict';

    var app = angular.module('vertical-scroll', ['ionic']);

    app.directive('addVerticalScroll', function ($timeout, $ionicScrollDelegate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var mainScrollID = attrs.horizontalScrollFix,
                    scrollID = attrs.delegateHandle;

                var getEventTouches = function (e) {
                    return e.touches && (e.touches.length ? e.touches : [
                        {
                            pageX: e.pageX,
                            pageY: e.pageY
                        }
                    ]);
                };

                var fixHorizontalAndVerticalScroll = function () {
                    var mainScroll, scroll;
                    mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
                    scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();
                    scroll.__container.removeEventListener('touchstart', scroll.touchStart);
                    scroll.touchStart = function (e) {
                        var startY;
                        scroll.startCoordinates = ionic.tap.pointerCoord(e);
                        if (ionic.tap.ignoreScrollStart(e)) {
                            return;
                        }
                        scroll.__isDown = true;
                        if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
                            scroll.__hasStarted = false;
                            return;
                        }
                        scroll.__isSelectable = true;
                        scroll.__enableScrollY = true;
                        scroll.__hasStarted = true;
                        scroll.doTouchStart ? scroll.doTouchStart(getEventTouches(e), e.timeStamp) : undefined;
                        startY = mainScroll.__scrollTop;
                    };
                    scroll.__container.addEventListener('touchstart', scroll.touchStart);
                };
                $timeout(function () {
                    fixHorizontalAndVerticalScroll();
                });
            }
        };
    });
})();
