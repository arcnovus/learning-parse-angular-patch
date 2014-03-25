/** Controls the home page. Not much here yet. */
(function (window, angular, Parse) {
    'use strict';
    var HomeController;

    HomeController = function ($scope, $log) {};

    angular.module('MainApp').controller('Home', HomeController);

}(this, this.angular, this.Parse)); // pass globals in explicitely to please JSLint