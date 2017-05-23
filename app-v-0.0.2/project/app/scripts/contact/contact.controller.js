(function() {
    'use strict';

    angular
        .module('starter.contact')
        .controller('ContactController', ContactController);

    ContactController.$inject = ['$state', 'contactService', '$scope', '$rootScope', '$log', 'popupService'];

    /* @ngInject */
    function ContactController($state, contactService, $scope, $rootScope, $log, popupService) {
        var vm = angular.extend(this, {
            viewName: $rootScope.currentUser.displayName,
            'messageForm': '',
            dataForm: {
                notice: '',
                message: '',
                timestamp: +new Date(),
                user: $rootScope.currentUser.$id
            },
            sendMessage: function() {
                if(this.messageForm.$valid){
                    contactService.sendMessage(this.dataForm);
                } else {
                    popupService.open('Ops!', 'Você deve preencher todos os campos!');
                }

            }
        });
    }
})();
