(function() {
    'use strict';

    angular
        .module('starter.chat')
        .factory('chatService', chatService);

    chatService.$inject = ['dataService', 'fb', '$firebaseObject', '$firebaseArray'];

    /* @ngInject */
    function chatService(dataService, fb, $firebaseObject, $firebaseArray) {
        var service = {
            sendMessage: sendMessage,
            createChat: createChat,
            resetUnreadMessages: resetUnreadMessages
        };
        return service;

        // ***************************************************************

        function sendMessage(message, order) {
            var orderId = order.guid;
            var query = fb.child('order_chat/' + orderId + '/chat/messages');
            return $firebaseArray(query).$add(message).then(function() {
                return addUnreadMessageCount(order).then(function() {
                    return message;
                });
            });
        }

        function addUnreadMessageCount(order) {
            var orderId = order.guid;
            var query = fb.child('order_chat/' + orderId + '/chat');
            return $firebaseObject(query).$loaded().then(function(chat) {
                var count = chat.chef_unread_messages_count || 0;
                chat.chef_unread_messages_count = ++count;
                return chat.$save();
            });
        }

        function resetUnreadMessages(order) {
            var orderId = order.guid;
            var query = fb.child('order_chat/' + orderId + '/chat');
            return $firebaseObject(query).$loaded().then(function(chat) {
                chat.user_unread_messages_count = 0;
                return chat.$save();
            });
        }

        function createChat(order) {
            var chat = {};
            chat.messages = false;
            chat.chef = order.chef;
            chat.user = order.user;
            chat.chef_unread_messages_count = 0;
            chat.user_unread_messages_count = 0;

            var query = fb.child('order_chat/' + order.guid);
            var ref = $firebaseObject(query);

            ref.chat = chat;
            return ref.$save();
        }
    }

})();
