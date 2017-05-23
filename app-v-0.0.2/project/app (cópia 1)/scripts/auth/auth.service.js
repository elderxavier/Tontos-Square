(function() {
    'use strict';

    angular
        .module('starter.auth').factory('authService', authService);

    authService.$inject = [
        '$firebaseAuth',
        'ngFB',
        '$rootScope',
        '$state',
        '$timeout',
        'ionicToast',
        'fb',
        '$q',
        '$firebaseObject',
        '$ionicPopup',
        'popupService',
        'ngDialog',
        'iuguService',
        'pushService'
    ];

    function authService(
        $firebaseAuth,
        ngFB,
        $rootScope,
        $state,
        $timeout,
        ionicToast,
        fb,
        $q,
        $firebaseObject,
        $ionicPopup,
        popupService,
        ngDialog,
        iuguService,
        pushService) {
        ngFB.init({ appId: '1739084176347557', tokenStore: window.localStorage });

        var currentUser = undefined;
        var isChefPopup = null;

        var service = {
            facebookLogin: facebookLogin,
            getCurrentUser: getCurrentUser,
            logout: logout,
            emailLogin: emailLogin,
            resetPassword: resetPassword,
            registerUser: registerUser,
            goToRegiser: goToRegister,
            closePopup: closePopup,
            registerChefToUser: registerChefToUser,
            onStateChanged: onStateChanged,
            signInWithEmailAndPassword: $firebaseAuth().$signInWithEmailAndPassword,
            successCallBack: null
        };

        return service;

        function onStateChanged() {
            $firebaseAuth().$onAuthStateChanged(function(eaterUser, error) {
                if (eaterUser) {
                    const newUser = getCurrentUser(eaterUser.uid);
                    if ($rootScope.currentUser && (newUser.$id === $rootScope.currentUser.$id)) {
                        console.log('Usuário já estava autenticado...');
                        return;
                    }
                    $rootScope.currentUser = newUser;
                    pushService.setUser(eaterUser.email);
                    checkIsChef(eaterUser.uid)
                        .then(function (isChef) {
                            if (isChef) {
                                onUserIsChef(eaterUser.uid);
                            } else if (service.successCallBack) {
                                service.successCallBack();
                                service.successCallBack = null;
                            } else {
                                $state.go('app.location');
                            }
                        });
                } else {
                    $rootScope.currentUser = null;
                    pushService.setUser(null);
                    $state.go('app.first-interaction');
                }
            });
        }

        function closePopup() {
            ngDialog.close();
        }

        function goToRegister() {
            ngDialog.close();
            $state.go('app.register');
        }

        function facebookLogin(successCallBack) {
            service.successCallBack = successCallBack;
            var deffered = $q.defer();

            ngFB.login({ scope: 'email' }).then(
                function(response) {
                    if (response.status === 'connected') {
                        var credential = firebase.auth.FacebookAuthProvider.credential(
                            response.authResponse.accessToken);

                        $firebaseAuth().$signInWithCredential(credential).then(function(authData) {

                            saveFacebookUser(authData).then(function(snapshot) {
                                $rootScope.currentUser = getCurrentUser(authData.uid);
                                pushService.setUser(response.email);
                            });

                            //$rootScope.$apply();
                            ionicToast.show('Logado com sucesso!', 'bottom', false, 2000);

                            $timeout(function() {
                                deffered.resolve($rootScope.currentUser);
                            }, 1500);

                        }).catch(function(error) {
                            console.log(error);
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                            deffered.reject(error);
                        });

                    } else {
                        console.log('Facebook login failed');
                        deffered.reject('Facebook login failed');
                    }
                }).catch(function(error) {
                console.log(error);
            });

            return deffered.promise;
        }

        function getCurrentUser(userId) {
            var query = fb.child('/users/' + userId);
            currentUser = $firebaseObject(query);
            return currentUser;
        }

        function checkIsChef(chefId) {
            var deffered = $q.defer();
            var query = fb.child('/chefs/' + chefId);
            $firebaseObject(query).$loaded().then(function(chef) {
                if (chef.email) {
                    deffered.resolve(true);
                } else {
                    deffered.resolve(false);
                }
            })
            return deffered.promise;
        }

        function logout() {
            return firebase.auth().signOut().then(function() {
                $rootScope.currentUser = null;
                //$rootScope.$apply();
                ionicToast.show('Deslogado com sucesso!', 'middle', false, 2000);
                $state.go('app.first-interaction');
            }, function(error) {
                console.log(error);
            });
        }

        /*
               Após autenticar as credenciais {email} e {password} na base de usuários é necessário verificar
               se esse usuário existe na tabela de usuários desse aplicativo especificamente.

               @author @dptole
             */
        function emailLogin(email, password, successCallBack) {
            console.log('successCallback=' + successCallBack);
            service.successCallBack = successCallBack;
            var deffered = $q.defer();
            service.signInWithEmailAndPassword(email, password).then(function(authData) {
                var currentUser = getCurrentUser(authData.uid);
                return currentUser.$loaded().then(function(user) {
                    console.log('chama user aqui =)...', user);
                    //if is not user
                    if (user.$value === null) {
                        //check if its chef
                        checkIsChef(authData.uid).then(function(isChef) {
                            if (isChef) {
                                onUserIsChef(authData.uid);
                            } else {
                                $rootScope.errorlogin = 'User or Chef not found.';
                                popupService.open('Falha no login!', 'Por favor, verificar seus dados de acesso');
                            }
                        });
                    } else {
                        emailLoginSuccess(email, password);
                        deffered.resolve(currentUser);
                    }
                });
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $rootScope.errorlogin = error;
                popupService.open('Falha no login!', 'Por favor, verificar seus dados de acesso');
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function emailLoginSuccess(email, password) {
            $rootScope.currentUser = currentUser;
            window.localStorage.setItem('username', email);
            window.localStorage.setItem('password', password);
            pushService.setUser(email);
        }

        function onUserIsChef(chefId) {
            if (isChefPopup) return;
            isChefPopup = popupService.openChoice(
                'Falha no Login!',
                'Você possui cadastro apenas como Chef, deseja se cadastrar como consumidor também?',
                'Sim',
                function(e) {
                    isChefPopup.close();
                    isChefPopup = null;
                    $state.go('app.register', {
                        chefId: chefId
                    });
                },
                'Não',
                null,
                null,
                function() {
                    isChefPopup.close();
                    isChefPopup = null;
                }
            );
        }

        function resetPassword(emailAddress) {
            firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
                popupService.open('E-mail enviado!', 'Por favor verificar a sua caixa de mensagens!');
                /*var alertPopup = $ionicPopup.alert({
                    title: 'Email enviado!',
                    template: 'Por favor verificar caixa de mensagens!',
                    cssClass: 'popup'
                });*/

            }, function(error) {
                console.log(error);
                if (error.code == 'auth/user-not-found') {
                    popupService.open('Usuário não cadastrado!', 'Por favor verificar o e-mail digitado ou cadastre-se!');
                    /*var alertPopup = $ionicPopup.alert({
                        title: 'Usuario não encontrado/cadastrado!',
                        template: 'Por favor verificar o email digitado ou cadastra-se!',
                        cssClass: 'popup'
                    });*/
                }
            });
        }

        function saveFacebookUser(authData) {
            var deffered = $q.defer();

            var uid = authData.uid;
            var user = {
                displayName: authData.displayName,
                name: authData.displayName,
                photoURL: authData.photoURL,
                email: authData.email,
                emailVerified: authData.emailVerified,
                providerId: authData.providerData[0].providerId
            };

            var ref = fb.child('/users/' + uid);
            ref.once("value")
                .then(function(snapshot) {
                    if (snapshot.exists()) {
                        //console.log('User already exists');
                    } else {
                        ref.set(user);
                    }

                    deffered.resolve(snapshot);
                });

            return deffered.promise;
        }


        function registerUser(user, successCallBack) {
            service.successCallBack = successCallBack;

            var deffered = $q.defer();
            $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password).then(function(authData) {
                window.localStorage.setItem('username', user.email);
                window.localStorage.setItem('password', user.password);
                var newUser = {
                    displayName: user.displayName,
                    name: user.displayName,
                    cpf: user.cpf || '',
                    email: user.email,
                    emailVerified: false,
                    phone: user.phone,
                    birthday: new Date(user.birthday.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1')).toISOString().substring(0, 10),
                    providerId: authData.providerData[0].providerId
                };

                var userId = authData.uid;
                var ref = fb.child('/users/' + userId);
                ref.once("value")
                    .then(function(snapshot) {
                        if (snapshot.exists()) {
                            //console.log('User already exists');
                        } else {
                            ref.set(newUser).then(function(user) {
                                getCurrentUser(userId).$loaded().then(function(user) {
                                    $rootScope.currentUser = user;
                                    iuguService.createCustomer().then(function(customer) {
                                        deffered.resolve(user);
                                    }).catch(function(error) {
                                        console.log(error);
                                        deffered.reject(error);
                                    });
                                });
                            })
                        }
                    });
            }).catch(function(error) {
                console.log(error);
                popupService.open('Erro', "O e-mail <div style='font-style: italic'>" + user.email + "</div> já existe em nossa base de dados");
                // ionicToast.show('Erro, o email: ' + user.email + ' já existe em nossa base de dados.', 'middle', false, 2000);
                deffered.reject(error);
            });

            return deffered.promise;
        }

        function registerChefToUser(user) {

            var deffered = $q.defer();
            $firebaseAuth().$signInWithEmailAndPassword(user.email, user.password).then(function(authData) {
                var newUser = {
                    displayName: user.displayName,
                    name: user.displayName,
                    cpf: user.cpf || '',
                    email: user.email,
                    emailVerified: false,
                    phone: user.phone,
                    photoURL: user.photoURL,
                    birthday: new Date(user.birthday.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1')).toISOString().substring(0, 10),
                    providerId: authData.providerData[0].providerId
                };

                var userId = authData.uid;
                var ref = fb.child('/users/' + userId);
                ref.once("value")
                    .then(function(snapshot) {
                        if (snapshot.exists()) {
                            //console.log('User already exists');
                        } else {
                            ref.set(newUser).then(function(user) {
                                getCurrentUser(userId).$loaded().then(function(user) {
                                    $rootScope.currentUser = user;
                                    iuguService.createCustomer().then(function(customer) {
                                        deffered.resolve(snapshot);
                                    }).catch(function(error) {
                                        console.log(error);
                                        deffered.reject(error);
                                    });
                                });
                            })
                        }
                    });
            }).catch(function(error) {
                console.log(error);
                popupService.open('Erro', "O e-mail <div style='font-style: italic'>" + user.email + "</div> já existe em nossa base de dados");
                // ionicToast.show('Erro, o email: ' + user.email + ' já existe em nossa base de dados.', 'middle', false, 2000);
                deffered.reject(error);
            });

            return deffered.promise;
        }
    }

})();
