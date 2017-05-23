(function() {
    'use strict';

    angular
        .module('starter.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$state', 'chatService', '$scope', '$rootScope',
        'order', 'fb', '$firebaseArray', '$firebaseObject', 'dataService', 'messageSender', '$ionicScrollDelegate'];

    /* @ngInject */
    function ChatController($state, chatService, $scope, $rootScope, order, fb, $firebaseArray, $firebaseObject, dataService, messageSender, $ionicScrollDelegate) {
        var orderId = order.guid;

        var query = fb.child('order_chat/' + orderId + '/chat/messages').orderByChild("timestamp");
        var vm = angular.extend(this, {
            messages: $firebaseArray(query),
            getSender: getSender,
            getSenderThumb: getSenderThumb,
            currentMessage: {},
            sendMessage: sendMessage,
            chefName: chefName,
            chefThumb: chefThumb
        });

        scroll();

        addListeners();
        
        function chefName () {
            return order.chef.name;
        }
        
        function chefThumb() {
            return order.chef.thumb;
        }
        
        function addListeners() {
            $scope.$on("$ionicView.enter", function(event, data) {
                //on enter view set all messages as read.
                chatService.resetUnreadMessages(order);
            });

            $scope.$on("$ionicView.leave", function(event, data) {
                //on leave view set all messages as read.
                chatService.resetUnreadMessages(order);
            });
        }

        function scroll() {
            vm.messages.$watch(function() {
                $ionicScrollDelegate.scrollBottom();
            });
        }

        function getSender(message) {
            var senderName = null;
            if (message.from === messageSender.USER) {
                senderName = order.user ? (order.user.displayName ? order.user.displayName : order.user.name) : 'usuário';
            } else if (message.from === messageSender.CHEF) {
                senderName = order.chef ? (order.chef.displayName ? order.user.displayName : order.chef.name) : 'chef';
            }
            return senderName
        }

        function getSenderThumb(message) {
            var senderThumb = 'images/icons/menu/profile_pink.png';
            if (message.from === messageSender.USER) {
                senderThumb = order.user && order.user.thumb ? order.user.thumb : senderThumb;
            } else if (message.from === messageSender.CHEF) {
                senderThumb = order.chef && order.chef.thumb ? order.chef.thumb : senderThumb;
            }
            return senderThumb;
        }

        function sendMessage() {
            if (vm.currentMessage.text) {
                var $messageField = angular.element(document.getElementById('message-field'));
                $messageField.css('height', '');
                
                var message = {};
                message.message = vm.currentMessage.text;
                message.from = messageSender.USER;
                message.to = messageSender.CHEF;
                message.timestamp = moment().unix();

                vm.currentMessage = {};

                return chatService.sendMessage(message, order);
            }
        }
    }
})();
