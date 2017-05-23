(function() {
    'use strict';

    angular
        .module('starter.help')
        .controller('HelpController', HelpController);

    HelpController.$inject = ['$state', 'helpService', '$scope', '$rootScope', 'fb', '$firebaseArray', '_'];

    /* @ngInject */
    function HelpController($state, helpService, $scope, $rootScope, fb, $firebaseArray, _) {
        var vm = angular.extend(this, {
            viewName: helpService.getModuleName(),
            isItemShown:isItemShown,
            items:[],
            shownItem:null,
            toggleItem:toggleItem

        });


        vm.items = [{
              title: 'O que são Doenças Transmitidas por Alimentos (DTA)?',
              text: 'São doenças provocadas pelo consumo de alimentos que ocorrem quando micróbios prejudiciais à saúde, parasitas ou substâncias tóxicas estão presentes no alimento.'
            },{
              title: 'O que são Boas Práticas?',
              text: 'São práticas de higiene que devem ser obedecidas pelos manipuladores desde a escolha e compra dos produtos a serem utilizados no preparo do alimento até a venda para o consumidor. '
            },{
              title: 'O que é contaminação?',
              text: 'Normalmente, os parasitas, as substâncias tóxicas e os micróbios prejudiciais à saúde entram em contato com o alimento durante a manipulação e preparo. Esse processo é conhecido como contaminação'
            },{
              title: 'O que são os micróbios?',
              text: 'Os micróbios são organismos vivos tão pequenos que só podem ser vistos por meio de um equipamento com potentes lentes de aumento chamado microscópio. Eles também são conhecidos como microrganismos. '
            }];

  function toggleItem(item) {
        if (vm.isItemShown(item)) {
              vm.shownItem = null;
        } else {
            vm.shownItem = item;
        };
    }

  function isItemShown(item) {
    return vm.shownItem === item;
  };



    }
})();
