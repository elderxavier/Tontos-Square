(function() {
    'use strict';
    
    var app = angular.module('selector-case', []);
    
    app.directive('selectorCaseButton', function(){
        return {
            restrict: 'E',
            replace: false,
            link: function(scope, element, attributes) {
                element.addClass('selector-case__button');
            }
        };
    });
    
    app.directive('selectorCase', function() {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            template: '<ng-transclude></ng-transclude>',
            link: function(scope, element, attributes) {
                element.addClass('selector-case');
                
                element.on("click", function(event) {
                    angular.forEach(event.target.parentElement.children, function(element) {
                        element.className = element.className.replace('selected', ''); 
                    });
                    
                    event.target.className += ' selected';
                });    
            },
            transclude: true
        };
    });    
})();