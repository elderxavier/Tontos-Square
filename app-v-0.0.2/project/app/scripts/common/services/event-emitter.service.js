(function () {
    'use strict';

    var app = angular.module('event-emitter', []);

    app.factory('EventEmitterService', function () {

        function EventEmitter() {
            var events = {};
            
            this.on = function (event, callback) {
                if(events[event] && events[event].indexOf(callback) !== -1 ){
                   return;
                }
                events[event] ? events[event].push(callback) : events[event] = [callback];
            }

            this.emit = function (event, args) {
                angular.forEach(events[event], function (callback) {
                    callback.apply({}, args);
                });
            }
        }
       
        return EventEmitter;
    });
})();
