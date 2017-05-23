(function() {
    'use strict';
    angular
        .module('starter.student')
        .controller('StudentController', StudentController);

    StudentController.$inject = ['$scope', 'studentService', 'student', 'ionicToast', '$state'];

    function StudentController($scope, studentService, student, ionicToast, $state) {
        console.log('student: ' + JSON.stringify(student.guid));

        var student = _.clone(student);

        var vm = angular.extend(this, {
            student: student
        });

    }
})();
