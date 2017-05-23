//This module is a mocking test one for studying pruposes.

(function() {
    'use strict';

    angular
        .module('starter.student', [
            'ionic',
            'ngCordova',
            'starter.common'
        ])
        .config(function($stateProvider) {
            $stateProvider
                .state('app.student', {
                    url: '/student/:studentId',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/student/student.html',
                            controller: 'StudentController as vm'
                        }
                    },
                    resolve: {
                        student: function($stateParams, studentService) {
                            var studentId = $stateParams.studentId;
                            return studentService.getStudentById(studentId);
                        }
                    }
                })
                .state('app.students', {
                    url: '/students/:groupId',
                    views: {
                        'menuContent': {
                            templateUrl: 'scripts/student/students.html',
                            controller: 'StudentsController as vm'
                        }
                    }
                });
        });
})();
