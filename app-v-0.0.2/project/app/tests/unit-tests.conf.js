// Karma configuration
// Generated on Thu Dec 15 2016 13:11:05 GMT-0200 (BRST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            '../bower_components/conversion.js/conversion.js',
            '../bower_components/angular/angular.js',
            '../bower_components/angular-animate/angular-animate.js',
            '../bower_components/angular-sanitize/angular-sanitize.js',
            '../bower_components/angular-ui-router/release/angular-ui-router.js',
            '../bower_components/ionic/release/js/ionic.js',
            '../bower_components/ionic/release/js/ionic-angular.js',
            '../bower_components/angular-websocket/angular-websocket.min.js',
            '../bower_components/ngCordova/dist/ng-cordova.js',
            '../bower_components/lodash/lodash.js',
            '../bower_components/angular-base64/angular-base64.js',
            '../bower_components/ionic-service-core/ionic-core.js',
            '../bower_components/ionic-service-push/ionic-push.js',
            '../bower_components/date.format/date.format.js',
            '../bower_components/geolib/dist/geolib.js',
            '../bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.js',
            '../bower_components/ionic-toast/dist/ionic-toast.bundle.min.js',
            '../bower_components/angular-local-storage/dist/angular-local-storage.js',
            '../bower_components/firebase/firebase.js',
            '../bower_components/angularfire/dist/angularfire.js',
            '../bower_components/angular-input-masks/angular-input-masks-standalone.js',
            '../bower_components/ngMask/dist/ngMask.js',
            '../bower_components/ngmap/build/scripts/ng-map.js',
            '../bower_components/angular-strap/dist/angular-strap.js',
            '../bower_components/angular-strap/dist/angular-strap.tpl.js',
            '../bower_components/angular-viacep/dist/angular-viacep.js',
            '../bower_components/angular-validation-match/dist/angular-validation-match.min.js',
            '../bower_components/angular-repeat-n/dist/angular-repeat-n.js',
            '../bower_components/ionic-rating/ionic-rating.js',
            '../bower_components/moment/moment.js',
            '../bower_components/angular-moment/angular-moment.js',
            '../bower_components/angular-credit-cards/release/angular-credit-cards.js',
            '../bower_components/ng-dialog/js/ngDialog.js',
            '../bower_components/angularjs-slider/dist/rzslider.js',
            '../bower_components/ng-walkthrough/ng-walkthrough.js',
            '../bower_components/ngmap/build/scripts/ng-map.min.js',
            '../bower_components/moment/locale/pt-br.js',
            '../bower_components/angular-lazy-img/release/angular-lazy-img.js',
            '../cordova.js',
            '../scripts/app.js',
            '../scripts/configuration.js',
            '../scripts/**/*.module.js',
            '../scripts/**/*.service.js',
            '../scripts/**/*.directive.js',
            '../scripts/**/*.controller.js',
            '../bower_components/angular-mocks/angular-mocks.js',
            'unit-tests/**/*.js'
        ],

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
