/*
 * @category    Model
 * @package     easycoop
 * @copyright    Easy System Desenvolvimento de Sistemas e Sites
 * @developer    Elder Xavier
 * @contact      elder@easysystem.com.br
 * @created      2016-10-18
 * @last update  2016-10-27
 * @Developer    Elde Xavier
 * @contact      contato@elderxavier.com.br
 */
angular.module('starter', ['ionic', 'ngCordova','starter.controllers', 'starter.services'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            })            
        })

