(function (window, angular) {

    'use strict';
    var HeaderController;

    // Controller for the header 
    HeaderController = function ($scope, $log, $route) {
        $scope.route = $route; // bring the route in scope

        // when the document is ready, set the browser window document title.
        angular.element(this.document).ready(function () {
            window.document.title = $scope.route.current.title;
        });

        // when the route changes, update the browser window document title.
        $scope.$on('$routeChangeSuccess', function (event, current, previous) {
            window.document.title = $scope.route.current.title;
        });
    };

    angular.module('MainApp').controller('Header', ['$scope', '$log', '$route', HeaderController]);

}(this, this.angular)); // pass globals in explicitely to please JSLint