(function (window, angular, Parse, steroids) {

    "use strict";

    var ngDependencies,
        app;

    steroids.on('ready', function () {
        steroids.view.navigationBar.show("MOBILE SEED");
    });

    Parse.initialize("TyfDCrcDQPRkUGnAz50DHESIOk4lvfMOEt3Xd02K", "t9FX9kEXiyJdRxgiszlonZyPdM8Ip7AbEnoVEZ3F");

    ngDependencies = [];
    ngDependencies.push('hmTouchEvents');
    ngDependencies.push('parse-angular');
    ngDependencies.push('parse-angular.enhance');

    app = angular.module('MainApp', ngDependencies);

    app.run(function ($rootScope) {

        var onDeviceReady,
            onOffline,
            onOnline;

        onOffline = function () {
            window.alert('Please connect to the internet');
            $rootScope.$broadcast('deviceOffline');
        };
        onOnline = function () {
            window.alert('Online!');
            $rootScope.$broadcast('deviceOnline');
        };

        onDeviceReady = function () {
            window.document.addEventListener('offline', onOffline, false);
            window.document.addEventListener('offline', onOnline, false);
        };

        window.document.addEventListener('deviceready', onDeviceReady, false);
    });



}(this, this.angular, this.Parse, this.steroids));