(function (window, angular, Parse) {
    'use strict';
    var HomeController;

    HomeController = function ($scope, $log) {
        $scope.model = {};
        $scope.salutations = [];
        $scope.salutationObj = {};

        var SalutationCollection,
            salutationList,
            SalutationClass,
            PersonCollection,
            PersonClass,
            personList,
            personObject,
            query,
            onSave;

        SalutationClass = Parse.Object.extend('Salutation');

        SalutationCollection = Parse.Collection.extend({
            model: SalutationClass
        });

        salutationList = new SalutationCollection();

        salutationList.fetch().then(function (data) {
            $scope.salutations = data.toJSON(); // converting to JSON makes an Angular-friendly copy of the collection
        });

        PersonClass = Parse.Object.extend('Person');
        personList = Parse.Collection.extend({
            model: PersonClass
        });
        query = new Parse.Query('Person');
        query.ascending('fname');
        query.find({
            success: function (data) {
                $scope.people = data; //JSON.parse(JSON.stringify(data));
            }
        });

        $scope.onSave = function () {
            personObject = new PersonClass();
            personObject.set($scope.model); // map our angular object to our Parse object
            personObject.save().then(function () {
                $log.debug("Person saved");
                $scope.model = {};
            });
        };

        $scope.editPerson = function (ix) {
            $scope.fname = $scope.people[ix].get('fname');
        };

    };

    angular.module('MainApp').controller('Home', HomeController);

}(this, this.angular, this.Parse));