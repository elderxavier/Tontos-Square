(function() {
  'use strict';

  var name = 'forgot-password';
  var stateConfig = {
    url: '/' + name,
    views: {
      'menuContent': {
        templateUrl: 'scripts/'+ name +'/'+ name +'.html',
        controller:'ForgotPasswordController as vm'
      }
    }
  };
  function ForgotPasswordController ($scope, $state, authService) {
    var vm = angular.extend(this, {
      resetPassword: function(email) {
         authService.resetPassword(email);
         $state.go('app.first-interaction');
      },
      email:''
    });
  }
  function config ($stateProvider) {
    $stateProvider.state('app.' + name, stateConfig);
  }

  angular
        .module('starter.' + name, [])
        .config(config)
        .controller('ForgotPasswordController', ForgotPasswordController);

  config.$inject = ['$stateProvider'];
  ForgotPasswordController.$inject = ['$scope', '$state', 'authService'];
}());
