(function() {
    'use strict';

    var app = angular.module('starter.sale-flow');
    app.factory('paymentModalService', paymentModalService);

    paymentModalService.$inject = ['ModalScaffoldService'];

    function paymentModalService(ModalScaffoldService) {
        var modal;

        function init(scope) {
            modal = new ModalScaffoldService(null, {
                fullPath: 'scripts/sale-flow/payment/payment-modal.html',
                class: 'payment-modal',
                overlay: false,
                close: false,
                scope: scope,
                controller: 'PaymentModalController',
                controllerAs: 'vm'
            });
            return modal;
        }

        function getModal() {
            return modal;
        }

        return {
            init: init,
            getModal: getModal,
            paymentMethodName: null,
            paymentMethods: []
        };
    }

})();
