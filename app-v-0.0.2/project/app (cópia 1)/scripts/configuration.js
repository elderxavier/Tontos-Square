"use strict";

 angular.module('config', [])

.constant('ENV', {
        name:'development',
        baseUrl:'http://ec2-52-67-190-31.sa-east-1.compute.amazonaws.com',
        dataProvider:'FIREBASE',
        firebaseUrl:'https://restaurant-backend.firebaseio.com/',
        youtubeKey:'AIzaSyDael5MmCQa1GKQNKQYypmBeB08GATgSEo',
        ionicPrivateKey:'a9265eaf15a20cc8516c770e8748aeed4891b28f453ce755',
        ionicPublicKey:'e30d4d540b8c75d1f167bbf242423c3fb23fe10275d1c016',
        ionicAppId:'241b6d37',
        gcmId:'556564836180',
        onesignalAppId:'75c60d78-9ddf-4c5e-9367-a93c624a0767'
    });