(function() {
	'use strict';

	angular
		.module('starter.student')
		.controller('StudentsController', StudentsController);

	StudentsController.$inject = ['$state', 'studentService'];

	/* @ngInject */
	function StudentsController($state, studentService) {
		var groupId = $state.params.groupId;

		var vm = angular.extend(this, {
			students: [],
			showStudentDetails: showStudentDetails
		});

		(function activate() {
			loadStudents();
		})();

		// ******************************************************

		function loadStudents() {
			return studentService.getGroupStudents(groupId).then(function(data) {
				vm.students = data;
			});
		}

		function showStudentDetails(studentId) {
			$state.go('app.student', {
				studentId: studentId
			});
		}
	}
})();