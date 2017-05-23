(function () {
    'use strict';

    var app = angular.module('starter.periods');
    app.factory('periodsModalService', periodsModalService);

    periodsModalService.$inject = [
        'ngDialog',
        '$ionicModal',
        '$ionicPopup'];

    function periodsModalService(
        ngDialog,
        $ionicModal,
        $ionicPopup) {
        var modal;

        var init = function () {
            $ionicModal.fromTemplateUrl('scripts/periods/periods-modal.html', {
                animation: 'slide-in-down'
            }).then(function (_modal) {
                modal = _modal;
            });
        };

        var show = function () {
            modal = $ionicPopup.show({
                templateUrl: 'scripts/periods/periods-modal.html',
                cssClass: 'popup-periods'
            })
            // ngDialog.open({
            //     template: 'scripts/periods/periods-modal.html',
            //     className: 'ngdialog-theme-default periods'
            // });
            // modal.show();
        };

        var hide = function () {
            modal.close();
            // modal.hide();
            // modal.remove();
        };

        return {
            init: init, hide: hide, show: show
        }
    }
})();
