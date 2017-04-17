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
        .factory('userService', function ($http, $q) {
            /*private scope*/
            var getDatabase = function () {
                    try {
                        if (window.openDatabase) {
                            var shortName = 'db_fichasweb';
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
            getApiUrl = "http://s2.desenvolvimento.grupobem.com.br/~tielder/s2/htdocs/webservice/v1/api.php";                     
            
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
                getUpdate: function (url, pagina, qtde) {
                    return {
                        run: $http({
                            method: 'GET',
                            url: url,
                            params: {pagina: pagina, qtde: qtde}
                        }).then(function successCallback(response) {
                            var stg = response.data.substring(response.data.indexOf('<string') + 36, response.data.indexOf("</string>"));
                            json = JSON.parse(stg);                            
                            return json;

                        }, function errorCallback(response) {
                            console.log("ERROR");
                            return false;
                        }, 'html')
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

        