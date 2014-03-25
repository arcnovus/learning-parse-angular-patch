/*jslint white: true */ // My code is beautiful JSLint, STFU!

// Main application setup.
(function (window, angular, Parse) {

    "use strict";

    var ngDependencies,
        app;

    // Put your Parse keys here.
    Parse.initialize("TyfDCrcDQPRkUGnAz50DHESIOk4lvfMOEt3Xd02K", "t9FX9kEXiyJdRxgiszlonZyPdM8Ip7AbEnoVEZ3F");

    // set up dependencies for the main Angular Module
    ngDependencies = [];
    ngDependencies.push('ngRoute'); // the Angular router
    ngDependencies.push('parse-angular'); // The Parse-Angular-Patch we are learning about 
    ngDependencies.push('parse-angular.enhance'); // Sugar on top of the Parse-Angular-Patch

    // register the main Angular Module
    app = angular.module('MainApp', ngDependencies);

    // set up our routes
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'views/home.html',
                controller: 'Home', // not sure why we set this here and in the html?
                name: 'Home',
                title: 'Home Page'
            }).
            when('/crud', {
                templateUrl: 'views/crud.html',
                controller: 'Crud',
                name: 'CRUD',
                title: 'CRUD Example > People List'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);

}(this, this.angular, this.Parse)); // pass globals in explicitely to please JSLint