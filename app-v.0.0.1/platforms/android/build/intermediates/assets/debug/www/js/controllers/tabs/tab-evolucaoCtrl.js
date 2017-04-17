angular.module('starter').controller('TabevolucaoCtrl', function ($scope, $state, $ionicSideMenuDelegate, $timeout, $ionicHistory, $rootScope) {
    $scope.conduta = {};

    $scope.conduta["36919459"] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "IDADE",
        orientacoes: "VERIFICAR E ORIENTAR CASA SEGURA"
    };

    $scope.conduta["36919460"] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "SEXO MASCULINO",
        orientacoes: "ORIENTAR AGENDAR UROLOGISTA 1 VEZ AO ANO"
    };

    $scope.conduta[36919461] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "ALERGIA",
        orientacoes: "VERIFICAR E ORIENTAR CASA SEGURA"
    };

    $scope.conduta[36919463] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "VISÃO APARENTEMENTE COMPROMETIDA",
        orientacoes: "ORIENTAR AGENDAR CONSULTA COM MÉDICO DA REDE"
    };

    $scope.conduta[36919464] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "POSSUI EQUIPAMENTOS",
        orientacoes: "VERIFICAR E ORIENTAR PARA UTILIZAÇÃO CORRETA"
    };

    $scope.conduta[36919465] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "CARDIOPATIA / IAM / HIPERTENSÃO ARTERIAL / DISLIPIDEMIA",
        orientacoes: "ORIENTAR AGENDAR CONSULTA COM MÉDICO DA REDE"
    };
    
    $scope.conduta[36919466] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "EXPOSIÇÃO AO SOL INADEQUADA E/OU SEM USO DE PROTETOR SOLAR",
        orientacoes: "ORIENTAR SOBRE USO DE PROTETOR SOLAR"
    };

    $scope.conduta[1] = {
        resposta: [
            {text: "Sim", value: "Sim"},
            {text: "Não", value: "Não"}
        ],
        riscos: "EXCESSO DE PESO",
        orientacoes: "ORIENTAR RISCOS DO SOBREPESO"
    };


    $scope.data = {
        conduta: {
            36919459: {resposta:"Sim"},
            36919460: {resposta:""},
            36919461: {resposta:""},
            36919463: {resposta:""},
            36919464: {resposta:""},
            36919465: {resposta:""},
            36919466: {resposta:""},
            1: {resposta:""}
        }
    };

    console.log($scope.conduta);




    //helpers functions private
    $timeout(function () {
    }, 3500);

})