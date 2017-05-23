(function(){
    'use strict';
    
    var app = angular.module('starter.common');
    app.factory('asyncService', asyncService);
    
    function asyncService() {
        
        var iterate = function (list, callback, done) {
            var counter = 0;
            var isDone = function() { return counter >= list.length }
            
            function run() {
                if(isDone()) return done();
                callback(list[counter], next);
            }
            
            function next() {
                counter++;
                run();
            }
            
            run();
        }
        
        return {
            iterate: iterate
        }
    }
    
})();