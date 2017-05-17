/*
 * @category    controller
 * @package     br.easysytem.com.mundosindical
 * @copyright    Easy System Desenvolvimento de Sistemas e Sites
 * @developer    Elder Xavier
 * @contact      elder@easysystem.com.br
 * @created      2016-10-18
 * @last update  2016-10-27
 * @Developer    Elde Xavier
 * @contact      contato@elderxavier.com.br
 */
angular.module('starter.controllers', [])
        //global scope
        .controller('homeappCtrl', function ($scope, $ionicModal) {            
            $scope.togleLoading = function (mili) {
                $('.loading').removeClass('hidden');
                setTimeout(function () {
                    $('.loading').addClass('hidden');
                }, mili);
            };                      
        })
 
        
        
        