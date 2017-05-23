(function() {
    'use strict';

    angular
        .module('starter.student')
        .factory('studentService', studentService);

    studentService.$inject = ['dataService', 'firebaseDataService', 'fb', '$firebaseObject', '$firebaseArray', '$q'];

    /* @ngInject */
    function studentService(dataService, firebaseDataService, fb, $firebaseObject, $firebaseArray, $q) {
        var service = {
            getStudentById: getStudentById,
            getGroupStudents: getGroupStudents
        }
        return service;

        function getStudentById(studentId) {
            var query = fb.child('students/' + studentId);
            return $firebaseObject(query).$loaded().then(dataService.initItem);
        }

        function getGroupStudents(groupId) {
            var query = fb.child('groups/' + groupId + '/students');
            return $firebaseArray(query).$loaded().then(dataService.initArray).then(function(studentIds){
                var deffered = $q.defer();
                var students = [];
                angular.forEach(studentIds, function(value, key){
                    var query = fb.child('students/' + value.guid);
                    $firebaseObject(query).$loaded().then(dataService.initItem).then(function(student){
                        students.push(student);
                        if(students.length === studentIds.length){
                            deffered.resolve(students);
                        }
                    });
                });
                return deffered.promise;
            });
        }
      
    }
})();
