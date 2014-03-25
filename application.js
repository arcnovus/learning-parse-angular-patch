/*jslint white: true */
(function (window, angular, Parse) {

    "use strict";

    var ngDependencies,
        app;



    Parse.initialize("APP-ID", "API-KEY");

    ngDependencies = [];
    ngDependencies.push('ngRoute');
    ngDependencies.push('parse-angular');
    ngDependencies.push('parse-angular.enhance');

    app = angular.module('MainApp', ngDependencies);

    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'views/home.html',
                controller: 'Home'
            }).
            when('/crud', {
                templateUrl: 'views/crud.html',
                controller: 'Crud'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);




}(this, this.angular, this.Parse));
