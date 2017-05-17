angular.module('starter').controller('agendaCtrl', function ($scope, $ionicModal, $ionicLoading, userService, $state, $rootScope, $ionicScrollDelegate, $timeout) {
    
    /*Model*/
    $scope.datainicial = new Date();
    $scope.datainicial.setHours(0, 0, 0, 0);
    $scope.datafinal = new Date();
    $scope.datafinal.setHours(23, 59, 0, 0);  
    $scope.itens = [];

    /*end Model*/

    /*private Scope*/
    var pagina = 1;
    funcao = 'getAgendaAssisitos';    
    data_inicio = formatedDate($scope.datainicial);
    data_final = formatedDate($scope.datafinal);        
    id_profissional = 204988 ;


    /*Helpers*/
    function formatedDate(date) {
          now = date;
          year = "" + now.getFullYear();
          month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
          day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
          hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
          minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }          
          return year  + month  + day + " " + hour + ":" + minute ;
    }
    /*end Helpers*/
    /*Public scope*/
    $ionicModal.fromTemplateUrl('templates/agenda/filtro-agenda.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalFilterAgenda = modal;
    });

    $scope.openModalFilterAgenda = function () {
        $scope.modalFilterAgenda.show();
    };
    $scope.closeModalFilterAgenda = function () {
        $scope.modalFilterAgenda.hide();
    };    
 
    $('#scroller-agenda').scroll(function (e) {                       
        var elementTop = $ionicScrollDelegate.$getByHandle('scroller-agenda').getScrollPosition().top;
        var compare = $(document).height() > elementTop ? $(document).height() : elementTop;                            
        var compare = $(document).height() > elementTop ? $(document).height() : elementTop;
            if (elementTop > (compare * 0.3)) {                                           
                pagina = pagina + 1;                           
                $scope.getItens(); 
            }   
                          
            e.preventDefault();        
        });   
    
    $scope.getItens = function(){
        $ionicLoading.show();
        params = {"funcao":funcao, "data_inicio": data_inicio, "data_final":data_final, "pagina":pagina, "id_profissional":id_profissional, "token": userService.getToken};        
            userService.getPage(params).run.then( 
            function successCallback(response) { 
                $ionicLoading.show();  
                angular.forEach(response.data.data, function(value, key){
                    $scope.itens.push(value);                    
                });                 
                $ionicLoading.hide();                                                                            
            }, function errorCallback(error) {
                console.error(error);  
                $ionicLoading.hide();                 
            });
    }

    $scope.confirmarModalAgenda = function(){
        var pagina = 1;
        data_inicio =  formatedDate(new Date($('input[name=datainicial]').val()));        
        data_final = formatedDate(new Date($('input[name=datafinal]').val()));        
        $scope.itens = [];
        $scope.getItens();
        $scope.closeModalFilterAgenda();
    }

    $scope.propag = false;

    $scope.setPropag = function(item){
        userService.setPropag(item);        
    }

    
    /*end Public scope*/
    /*Init*/    

    $scope.$on("$ionicView.beforeEnter", function(event, data){
        $ionicLoading.show();
    });  

    $scope.$on("$ionicView.enter", function(event, data){ 
    $scope.getItens(); 
    $ionicLoading.hide();       
        
    });

    $timeout(function () {
    }, 500);

})

