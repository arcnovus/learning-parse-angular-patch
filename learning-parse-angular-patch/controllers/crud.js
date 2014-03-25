(function (window, angular, Parse) {
    'use strict';
    var CrudController;

    CrudController = function ($scope, $log) {
        $scope.model = {};
        $scope.salutation = '';
        $scope.salutations = [];
        $scope.salutationObj = {};
        $scope.editRow = -1;

        var SalutationCollection,
            salutationList,
            SalutationClass,
            mister,
            missus,
            doctor,
            miss,
            colonel,
            PersonCollection,
            PersonClass,
            personList,
            personObject,
            query,
            onSave,
            getSalutations,
            seedSalutaions;

        SalutationClass = Parse.Object.extend('Salutation');

        SalutationCollection = Parse.Collection.extend({
            model: SalutationClass
        });

        salutationList = new SalutationCollection();

        seedSalutaions = function () {
            $scope.seedingSalutations = true;
            mister = new SalutationClass();
            mister.set({
                'label': 'Mr.'
            });
            missus = new SalutationClass();
            missus.set({
                'label': 'Mrs.'
            });
            doctor = new SalutationClass();
            doctor.set({
                'label': 'Dr.'
            });
            colonel = new SalutationClass();
            colonel.set({
                'label': 'Col.'
            });
            Parse.Object.saveAll([mister, missus, doctor, colonel]).then(function () {
                $scope.seedingSalutations = false;
            });
        };

        getSalutations = function () {
            salutationList.fetch().then(function (data) {
                if (data.length > 0) {
                    $scope.salutations = data.toJSON();
                } else {
                    if (!$scope.seedingSalutations) {
                        seedSalutaions();
                    }
                }
            });
        };

        getSalutations();

        // maps the selected salutation to the model
        $scope.$watch('salutation', function (newValue, oldValue) {
            $scope.model.salutation = newValue.label;
        });

        PersonClass = Parse.Object.extend('Person');
        personList = Parse.Collection.extend({
            model: PersonClass
        });

        query = new Parse.Query('Person');
        query.ascending('fname');
        query.find({
            success: function (data) {
                $scope.people = data;
            }
        });

        $scope.onSave = function () {
            personObject = new PersonClass();
            if ($scope.editRow > -1) {
                var currentPerson = $scope.people[$scope.editRow].id,
                    newPerson = $scope.model;
                currentPerson.set('salutation', $scope.salutation);
                currentPerson.set('fname', newPerson.fname);
                currentPerson.set('lname', newPerson.lname);
                $scope.model = currentPerson;
            }
            personObject.set($scope.model); // map our angular object to our Parse object
            personObject.save().then(function () {
                $log.debug("Person saved");
                if ($scope.editRow === -1) {
                    $scope.people.splice(0, 0, personObject);
                }
                $scope.model = {};
                $scope.cancelEdit();
            });
        };

        $scope.editPerson = function (ix) {
            var currentPerson = $scope.people[ix];
            $scope.salutation = {
                'label': currentPerson.salutation
            };
            $scope.model.fname = currentPerson.fname;
            $scope.model.lname = currentPerson.lname;
            $scope.editRow = ix;
        };

        $scope.cancelEdit = function () {
            $scope.editRow = -1;
        };

        $scope.onDelete = function (ix) {
            $scope.people[ix].destroy().then(function () {
                $scope.people.splice(ix, 1);
            });
        };

    };

    angular.module('MainApp').controller('Crud', CrudController);

}(this, this.angular, this.Parse));