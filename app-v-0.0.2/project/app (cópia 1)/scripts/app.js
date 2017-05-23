var app = angular.module('starter', [
    'ionic',
    'ionic.service.core',
    'ionic.service.push',

    'ngCordova',
    'ngCordovaOauth',
    'ionic-toast',
    'LocalStorageModule',
    'firebase',
    'angularMoment',
    'ng-walkthrough',
    'ion-floating-menu',
    'angular.filter',

    'config',

    'starter.address-confirmation',
    'starter.auth',
    'starter.categories',
    'starter.chat',
    'starter.chefdetail',
    'starter.chefs',
    'starter.contact',
    'starter.first-interaction',
    'starter.help',
    'starter.home',
    'starter.image',
    'starter.labor',
    'starter.location',
    'starter.loggi',
    'starter.menu',
    'starter.orders',
    'starter.periods',
    'starter.plate',
    'starter.popup',
    'starter.profile',
    'starter.register',
    'starter.restaurant-cart',
    'starter.reviews',
    'starter.sale-flow',
    'starter.tags',
    'starter.user',
    'starter.validation',
    'starter.forgot-password',
    'starter.iugu',
    'starter.search',
    'starter.time',

    'starter.login-test',

    'gMaps',
    'ngMap',
    'ngMask',
    'ui.utils.masks',
    'credit-cards',
    'validation.match',
    'angular-repeat-n',
    'ionic.rating',
    'ngDialog',
    'rzModule',
    'angularLazyImg',
    'jett.ionic.filter.bar'
]);

app.value('_', window._);

app.run(function($ionicPlatform, locationService, $rootScope, $window, popupService, pushService, amMoment, moment) {

    amMoment.changeLocale('pt-br');

    function handleEvents() {
        document.addEventListener("resume", function() {
            console.log('########### DEVICE RESUMED');
            if (locationService) {
                locationService.getPosition();
            }
        }, false);

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            window.open = cordova.InAppBrowser.open;
            StatusBar.overlaysWebView(true);
            StatusBar.styleBlackTranslucent();
            StatusBar.backgroundColorByHexString('#000000');

            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    if (toState.name === 'app.first-interaction') {
                        StatusBar.overlaysWebView(true);
                        StatusBar.styleBlackTranslucent();
                        StatusBar.backgroundColorByHexString('#000000');

                    } else {
                        StatusBar.overlaysWebView(false);
                        StatusBar.backgroundColorByHexString('#CE5D68');
                        StatusBar.styleLightContent();

                    }
                }
            );
        }
    }

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            // TO-DO: AccessoryBar é necessária para ter botão "Done" em inputs numéricos
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (pushService.isAvailable()) {
            pushService.setup();
        }

        if (locationService) {
            console.log('########### DEVICE READY');
            locationService.getPosition();
        }

        handleEvents();
    });

    // Verifica a conectividade do cliente
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    $window.addEventListener("online", function() {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function() {
        onlineStatus.onLine = false;
        $rootScope.$digest();
        popupService.open("Ops!", "Você não está conectado na internet =/");
    }, true);

});

app.config(function($urlRouterProvider, $provide, $httpProvider, $ionicConfigProvider,  $ionicFilterBarConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c');
    $ionicFilterBarConfigProvider.placeholder('Buscar');

    //disable menu swipe back
    $ionicConfigProvider.views.swipeBackEnabled(false);

    //CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // set default view
    $urlRouterProvider.otherwise('/app/first-interaction');

    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});
app.run(function(authService) {
    authService.onStateChanged();
});
