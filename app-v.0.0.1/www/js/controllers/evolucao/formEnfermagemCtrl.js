angular.module('starter').controller('formEnfermagemCtrl', function ($scope, $ionicModal, $ionicLoading, userService, $state, $rootScope, $ionicScrollDelegate, $timeout) {

   /*Global scope*/
   $(document).on('keyup','.custom_modal input[type=text], .custom_modal textarea', function(event){
        var elid = $(this).attr('id');                
        $('#'+ elid + 'span').html($("#"+elid).val());
        event.preventDefault();
    });
    
    $(document).on('change','.custom_modal select', function(event){
        var elid = $(this).attr('id');        
        console.log(elid, ": ", $("#"+elid).val());
        $('#'+ elid + 'span').html($("#"+elid).val());
        event.preventDefault();
    });
    
    /*end Global scope*/
    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-dados-acompanhamento.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalDadosAcompanhamento = modal;
    });

    $scope.propag = "teste";
    $scope.propag = userService.getPropag();

    $scope.listProfissionais = [];

    $scope.$on("$ionicView.enter", function (event, data) {
        $scope.getProfissionais();

    });

    $scope.id_tipo_contato = [
        {text: "Assistido", value: "Assistido"},
        {text: "Cuidador", value: "Cuidador"},
        {text: "Outros", value: "Outros"}
    ];

    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-dados-visita.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalDadosVisita = modal;
    });


    $scope.conjugada_sn = [
        {text: "Visita Inicial", value: "Visita Inicial"},
        {text: "Visita Conjugada", value: "Visita Conjugada"}
    ];
    $scope.dvkmvalue = $scope.dvkm;
    $scope.dvkm = "";
    $scope.dvhorachegada;
    $scope.dvhorasaida;

    $scope.data = {
        id_tipo_contato: "",
        conjugada_sn: "",
        dvkm: "sdf"
    };

    $(document).on('change', '#dvhorachegada', function () {
        $('#dvhorachegadaspan').html($("#dvhorachegada").val());
    });
    $(document).on('change', '#dvhorasaida', function () {
        $('#dvhorasaidaspan').html($("#dvhorasaida").val());
    });

    $(document).on('keyup', '#dvkm', function () {
        $('#dvkmspan').html($("#dvkm").val());
    });


    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-antecedentes-pessoais.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalAntecedentesPessoais = modal;
    });

    $scope.ant_doencas_pessoais = [
        {text: "Diabetes mellitus", checked: false, value: 1},
        {text: "Nefropatia", checked: false, value: 5},
        {text: "Dislipidemia", checked: false, value: 9},
        {text: "Osteomusculares", checked: false, value: 13},
        {text: "Hipertensão Arterial", checked: false, value: 2},
        {text: "Hepatopatia", checked: false, value: 6},
        {text: "Neuropatia", checked: false, value: 10},
        {text: "Infecção do trato urinário", checked: false, value: 14},
        {text: "Doenças Infecto Cont.", checked: false, value: 3},
        {text: "Pneumopatia", checked: false, value: 7},
        {text: "IAM", checked: false, value: 11},
        {text: "Síndrome demencial", checked: false, value: 15},
        {text: "Cardiopatia", checked: false, value: 4},
        {text: "AVC", checked: false, value: 8},
        {text: "Oncologia", checked: false, value: 12},
        {text: "Doença de Parkinson", checked: false, value: 16}
    ];

    $(document).on('click, touchstart', '#modal-antecedentes-pessoais .checkbox-icon', function (event) {
        console.log("OK");
        console.log($(this).closest('label').find('item-content').html());
        event.preventDefault();
    });

    $(document).on('change', '#modal-antecedentes-pessoais input[type=checkbox]', function (event) {
        if ($(this).is(":checked")) {
            console.log($(this).closest('label').find('.item-content span').html());
            var t = $(this).closest('label').find('.item-content span').html();
            $('#add-chip-ap').append('<span class="chip" id="chip_' + $(this).val() + '">' + t + '</span>');
        } else {
            $('#chip_' + $(this).val()).remove();
        }
        event.preventDefault();
    });

    $scope.ant_alergia_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.data_ap = {
        ant_alergia_sn: ""
    }
    $scope.ant_alergia_obs = "";

    $(document).on('keyup', '#ant_alergia_obs', function () {
        $('#ant_alergia_obsspan').html($("#ant_alergia_obs").val());
    });

    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-oncologia.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalOncologia = modal;
    });

    $scope.oncologia_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.oncologia_anterior_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];


    $scope.data_o = {
        oncologia_sn: "",
        oncologia_anterior_sn: ""
    }

    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-demais-informacoes.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalDemaisInformacoes = modal;
    });

    $scope.pcs_observacoes = "";

    $(document).on('keyup', '#pcs_observacoes', function () {
        $('#pcs_observacoesspan').html($("#pcs_observacoes").val());
    });

    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-habitos-vida.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalHabitosVida = modal;
    });

    $scope.rd_fumo = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_fumo = false;
    $scope.viewYesRdFumo = function () {
        if ($scope.data_hv.rd_fumo == "Sim") {
            $scope.yes_rd_fumo = true;
        } else {
            $scope.yes_rd_fumo = false;
        }
    }
    $scope.hab_fumo = "";
     $scope.id_tipo_fumo = [
         {text: "-", value: "-"},
        {text: "Nicotina", value: "Nicotina"},
        {text: "Caximbo", value: "Caximbo"},
        {text: "Charuto", value: "Charuto"},
        {text: "Cigarrilha", value: "Cigarrilha"},
        {text: "Outros", value: "Outros"},        
    ];
    
    
    

    $scope.rd_bebida = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_bebida = false;
    $scope.viewYesRdBebida = function () {
        if ($scope.data_hv.rd_bebida == "Sim") {
            $scope.yes_rd_bebida = true;
        } else {
            $scope.yes_rd_bebida = false;
        }
    }

    $scope.hab_bebida = "";

    $scope.lazer_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_lazer_sn = false;
    $scope.viewYesLazerSn = function () {
        if ($scope.data_hv.lazer_sn == "Sim") {
            $scope.yes_lazer_sn = true;
        } else {
            $scope.yes_lazer_sn = false;
        }
    }

    $scope.rd_baile = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_baile = false;
    $scope.viewRdBailen = function () {
        if ($scope.data_hv.rd_baile == "Sim") {
            $scope.yes_rd_baile = true;
        } else {
            $scope.yes_rd_baile = false;
        }
    }
    $scope.hab_baile = "";

    $scope.rd_jogos = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_jogos = false;
    $scope.viewRdJogos = function () {
        if ($scope.data_hv.rd_jogos == "Sim") {
            $scope.yes_rd_jogos = true;
        } else {
            $scope.yes_rd_jogos = false;
        }
    }
    $scope.hab_jogos = "";

    $scope.rd_cruzadas = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_cruzadas = false;
    $scope.viewRdCruzadas = function () {
        if ($scope.data_hv.rd_cruzadas == "Sim") {
            $scope.yes_rd_cruzadas = true;
        } else {
            $scope.yes_rd_cruzadas = false;
        }
    }
    $scope.hab_cruzada = "";
    
    $scope.rd_manual = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_manual = false;
    $scope.viewRdManual = function () {
        if ($scope.data_hv.rd_manual == "Sim") {
            $scope.yes_rd_manual = true;
        } else {
            $scope.yes_rd_manual = false;
        }
    }
    $scope.hab_manual = "";
    
    $scope.hab_viagem = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];
    
    $scope.rd_passeio = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_passeio = false;
    $scope.viewRdPasseio = function () {
        if ($scope.data_hv.rd_passeio == "Sim") {
            $scope.yes_rd_passeio = true;
        } else {
            $scope.yes_rd_passeio = false;
        }
    }
    $scope.hab_passeio = "";
    
    $scope.rd_atividade_fisica = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];

    $scope.yes_rd_atividade_fisica = false;
    $scope.viewRdAtividadeFisica = function () {
        if ($scope.data_hv.rd_atividade_fisica == "Sim") {
            $scope.yes_rd_atividade_fisica = true;
        } else {
            $scope.yes_rd_atividade_fisica = false;
        }
    }
    $scope.hab_atividade_fisica = "";
    
    $scope.hab_outros_lz = "";
    
    $scope.hab_outros_semana = "";
    
    $scope.data_hv = {
        rd_fumo: "",
        id_tipo_fumo:"-", 
        rd_bebida: "",
        lazer_sn: "",
        rd_baile:"",
        rd_jogos: "",
        rd_cruzadas: "",
        rd_manual:"",
        hab_viagem:"",
        rd_passeio:"",
        rd_atividade_fisica:""
    }
    
    
    
    
    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-queixas.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalQueixas = modal;
    });
    
    $scope.rd_queixas = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];
    
    $scope.queixas = "";
    
    $scope.yes_rd_queixas = false;
    $scope.viewYesRdQueixas = function () {
        if ($scope.data_q.rd_queixas == "Sim") {
            $scope.yes_rd_queixas = true;
        } else {
            $scope.yes_rd_queixas = false;
        }
    }
    
    $scope.data_q = {
        rd_queixas:""
    }
    
    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-nivel-consiencia.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalNivelConsiencia = modal;
    });
    
    
    $scope.sit_orientado_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];
    
    $scope.sit_problema_memoria_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];
    
    
    $scope.yes_sit_problema_memoria_sn = false;
    $scope.viewYesSitProblemaMemoriaSn = function () {
        if ($scope.data_nc.sit_problema_memoria_sn == "Sim") { 
            $scope.yes_sit_problema_memoria_sn = true;
        } else {
            $scope.yes_sit_problema_memoria_sn = false;
        }
    }
    
    
    $scope.pontuacao_meem = "";
    
    $scope.id_sit_contactuante = [
        {text: "-", value: "-"},
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"},
        {text: "Dislalia", value: "Dislalia"}        
    ];
    
    $scope.sit_problema_memoria_recente_sn = [
        {text: "Sim", value: "Sim"},
        {text: "Não", value: "Não"}
    ];
    
    $scope.pcs_consciencia_obs = "";
    $scope.data_nc = {
        sit_orientado_sn:"",
        sit_problema_memoria_sn:"",
        id_sit_contactuante:"-",
        sit_problema_memoria_recente_sn:"",
        pontuacao_meem:"",
        pcs_consciencia_obs:""
    }
    
    /*Acuidade sensorial*/
    $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-acuidade-sensorial.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalAcuidadeSensorial = modal;
    });
    
    $scope.id_audicao_acuidade = [
        {text: "-", value: "-"},
        {text: "Esquerdo", value: "Esquerdo"},
        {text: "Direito", value: "Direito"},
        {text: "Ambos", value: "Ambos"}
        
    ];
    
    
    $scope.id_visao_acuidade = [
        {text: "-", value: "-"},
        {text: "Esquerdo", value: "Esquerdo"},
        {text: "Direito", value: "Direito"},
        {text: "Ambos", value: "Ambos"}
        
    ];
    
    $scope.id_ant_ortese_auditiva = [
        {text: "-", value: "-"},
        {text: "Aparelho externo", value: "Aparelho externo"},
        {text: "Aparelho externo", value: "Aparelho externo"}
    ];
    
    $scope.ant_ortese_oftalmica = "";
    
    
    $scope.data_as = {
        id_audicao_acuidade:"-",
        id_visao_acuidade:"-",
        id_ant_ortese_auditiva:"-",
        ant_ortese_oftalmica:""
    }    
    /*fim Acuidade sensorial*/
    /*Respiração*/
     $ionicModal.fromTemplateUrl('templates/agenda/tabs/formularios/enfermagem/modal-respiracao.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalRespiracao = modal;
    });
    /*Fim Respiração*/
    
    
    
    $scope.toppings = false;
    $timeout(function () {
    }, 500);


    // Default values
    //$scope.data = {};
    //$scope.data.grossOptions = 'year';
    //$scope.data.resultOptions = 'month';




})

