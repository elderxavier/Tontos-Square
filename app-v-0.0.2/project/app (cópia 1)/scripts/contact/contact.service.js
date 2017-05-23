(function() {
    'use strict';

    angular
        .module('starter.contact')
        .factory('contactService', contactService);

    contactService.$inject = ['dataService', 'fb', '$firebaseArray', 'popupService'];

    /* @ngInject */
    function contactService(dataService, fb, $firebaseArray, popupService) {
        var service = {
            getModuleName: getModuleName,
            sendMessage: sendMessage
        };
        return service;

        // ***************************************************************

        function getModuleName() {
            return 'Contato';
        }

        function sendMessage(data) {
            var ref = fb.child('/contact');
            var arr = $firebaseArray(ref);
            function sendSuccess(response) {
                popupService.open('Sucesso!', 'Sua mensagem foi enviada!');
            }
            function sendError(error) {
                popupService.open('Ops!', 'Sua mensagem foi enviada!');
            }
            if(data.user) {
             return arr.$add(data).then(sendSuccess, sendError)
         } else {
             popupService.open('Ops!', 'Houve um erro ao enviar sua mensagem, por favor, tente novamente!');
         }

        }
    }

})();
