(function () {
    'use strict';

    angular.module('starter.common')
        .filter('formatPrice', function () {

            return function (platePrice) {
                var temp = '' + platePrice;
                var priceArray = temp.split('.');
                if(priceArray.length < 2){
                    priceArray.push('00');
                }
                if(priceArray[1].length < 2){
                    priceArray[1] += '0';
                }
                return 'R$ ' + priceArray[0] + ',' + priceArray[1]
            };
        });
})();
