/*
 * @category    services
 * @package     br.easysytem.com.mundosindical
 * @copyright    Easy System Desenvolvimento de Sistemas e Sites
 * @developer    Elder Xavier
 * @contact      elder@easysystem.com.br
 * @created      2016-10-18
 * @last update  2016-10-21
 * @Developer    Elde Xavier
 * @contact      contato@elderxavier.com.br
 */
angular.module('starter.services', [])
        .factory('tontosService', function ($http, $q) {
            /*private scope*/
            var getDatabase = function () {
                    try {
                        if (window.openDatabase) {
                            var shortName = 'db_tontossquare';
                            var version = '1.0';
                            var displayName = 'Data base app Fichas Web';
                            var maxSize = 20971520; // 20 MB
                            db = openDatabase(shortName, version, displayName, maxSize);
                            return db;
                        }
                    } catch (e) {
                        console.log("error:", e);
                        return false;
                    }
                };
            //getApiUrl = "http://localhost:5000";
            getApiUrl = "http://31.220.59.87:5000";            
            getToken = "AE3998A5B3F84DD16E872ED37BCFE";
            
            Propag =false;
            

            /*Helpers*/            
            return {
                'getToken' : "AE3998A5B3F84DD16E872ED37BCFE", 
                getPage: function (params) {                    
                    return {
                        run: $http({
                            method: 'GET',
                            url: getApiUrl,
                            params: (params)
                        })
                    }
                },
                getResults: function (url, method) {
                    return {
                        run: $http({
                            method: method,
                            url: getApiUrl + url  + getToken + "/"
                        })  
                    }

                },
                View: function () {
                    return {
                        set: function (query) {                            
                            window.localStorage['views'] = JSON.stringify(query);
                        },
                        get: function () {
                            return JSON.parse(window.localStorage['views']);
                        },
                    }

                },                            
                'executeQuery': function (query, succ_fun) {
                    getDatabase().transaction(function (tx) {
                        eval(succ_fun),
                        tx.executeSql(query, [], function (tx, error){
                            //console.log(error);
                        }                         
                        );                        
                    });
                },
                'getItems': function (query, succ_fun) {
                    itens = {};                    
                    getDatabase().transaction(function (tx) {
                        tx.executeSql(query, [], function (tx, results) {
                            for (var i = 0; i < results.rows.length; i++) {
                                row = results.rows.item(i);
                                itens[i] = row;
                                eval(succ_fun);
                            }

                        },
                                function (tx, error) {
                                    console.log(error);
                                }

                        );
                    });
                    return itens;
                },
                'setPropag': function (variable) {
                    Propag = variable;
                },
                'getPropag': function (variable) {
                    return Propag;
                }
            }

        })

        