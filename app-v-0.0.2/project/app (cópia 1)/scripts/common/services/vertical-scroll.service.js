(function() {
    'use strict';
    
    var app = angular.module('starter.common');
    app.factory('verticalScrollService', verticalScrollService);
    
    verticalScrollService.$inject = ['$timeout', '$ionicScrollDelegate'];
    
    function verticalScrollService ($timeout, $ionicScrollDelegate) {
        
        var _add = function (delegateHandle) {
            //return false; // <--- comment this to "fix" the problem
            var sv = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

            var container = sv.__container;

            var originaltouchStart = sv.touchStart;
            var originalmouseDown = sv.mouseDown;
            var originaltouchMove = sv.touchMove;
            var originalmouseMove = sv.mouseMove;

            container.removeEventListener('touchstart', sv.touchStart);
            container.removeEventListener('mousedown', sv.mouseDown);
            document.removeEventListener('touchmove', sv.touchMove);
            document.removeEventListener('mousemove', sv.mousemove);


            sv.touchStart = function (e) {
                e.preventDefault = function () {}
                originaltouchStart ? originaltouchStart.apply(sv, [e]) : undefined;
            }

            sv.touchMove = function (e) {
                e.preventDefault = function () {}
                originaltouchMove ? originaltouchMove.apply(sv, [e]) : undefined;
            }

            sv.mouseDown = function (e) {
                e.preventDefault = function () {}
                originalmouseDown ? originalmouseDown.apply(sv, [e]) : undefined;
            }

            sv.mouseMove = function (e) {
                e.preventDefault = function () {}
                originalmouseMove ? originalmouseMove.apply(sv, [e]) : undefined;
            }

            container.addEventListener("touchstart", sv.touchStart, false);
            container.addEventListener("mousedown", sv.mouseDown, false);
            document.addEventListener("touchmove", sv.touchMove, false);
            document.addEventListener("mousemove", sv.mouseMove, false);
        };
        
        var add = function (delegateHandle) {
            $timeout(_add.bind({}, delegateHandle), 100);
        }
        
        return { 
            add: add
        }
    }
    
})();