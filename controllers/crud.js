/**
 * crud.js controls the crud screen and also contains our models
 * (ideally models should be moved to a dedicated module under /models)
 */
(function (window, angular, Parse) {
    'use strict';
    var CrudController;

    // Controller for the crud screen
    CrudController = function ($scope, $log) {
        $scope.model = {}; // our proxy object for the parse data we are crudding
        $scope.salutation = ''; // the currently selected salutation 
        $scope.salutations = []; // the list of salutations to bind to the drop down
        $scope.editRow = -1; // the index of the current row being editted (-1 for none)
        $scope.showAdd = false; // hide the Add New Person button.
        $scope.loadingMsg = 'Loading people...'; // Message to show while loading people

        var SalutationCollection, // Parse Collection of salutations
            salutationList, // List of Parse Salutation objects.
            SalutationClass, // Parse Salutation class
            // These will be used to seed the Salutation table if it doesn't exist
            mister, // Salutation: Mr. 
            missus, // Salutation: Mrs.
            doctor, // Salutation: Dr.
            miss, // Salutation: Ms. 
            colonel, // Salutation: Col.
            // End seed data vars
            PersonCollection, // Parse Collection of Person Classes
            PersonClass, // Instance of Parse Person 
            personList, // List of Parse Person objects
            personObject, // Single Parse Person object
            query, // Query for Salutations
            getSalutations, // Method to get Salutations
            seedSalutaions; // Method to seed a Parse Salutation table if it doesn't exist 

        SalutationClass = Parse.Object.extend('Salutation'); // define Salutation

        // define Salutation Collection
        SalutationCollection = Parse.Collection.extend({
            model: SalutationClass
        });

        salutationList = new SalutationCollection();

        //  Creates the Parse "database table" if it doesn't exist and seeds it with data.
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

        // Grab a list of Salutations from Parse and bind it to our dropdowns
        getSalutations = function () {
            salutationList.fetch().then(function (data) {
                if (data.length > 0) {
                    // we convert the collection to JSON so it's Angular-friendly (NOT good for BIG collections)
                    $scope.salutations = data.toJSON();
                } else {
                    // if we are not currently seeding Salutations
                    if (!$scope.seedingSalutations) {
                        seedSalutaions(); // seed some.
                    }
                }
            });
        };

        // Get the list of Salutations from Parse
        getSalutations();

        // Automagically map the selected salutation to the model
        $scope.$watch('salutation', function (newValue, oldValue) {
            $scope.model.salutation = newValue.label;
            $log.debug('salutation changed');
        });

        // Requisite Parse class definitions
        PersonClass = Parse.Object.extend('Person');
        personList = Parse.Collection.extend({
            model: PersonClass
        });

        // Get the list of existing people from Parse (ordered alphabetically for fun - NB: UPPER CASE is sorted ahead of lower case).
        query = new Parse.Query('Person');
        query.ascending('fname');
        query.find({
            success: function (data) {
                if (data.length > 0) {
                    $scope.loadingMsg = '';
                }
                $scope.people = data;
            }
        });

        // When the big "Add New Person" button is clicked
        $scope.onAdd = function () {
            $scope.model = {}; // clear any data leftover from our last transaction
            $scope.showAdd = true; // show the Add Person form.
            $scope.onCancel(); // hide any edit rows
        };

        // When the save button is clicked
        $scope.onSave = function () {
            personObject = new PersonClass();
            // set the id if this is an edit of an existing Person
            if ($scope.editRow > -1) {
                $scope.model.id = $scope.people[$scope.editRow].id;
                if ($scope.model.salutation.label) {
                    $scope.model.salutation = $scope.model.salutation.label;
                }
            }
            personObject.set($scope.model); // map our Angular object to our Parse object
            personObject.save().then(function () {
                $log.debug("Person saved");
                // put the updated object in the grid on screen
                if ($scope.editRow > -1) { // if this is an update
                    // replace the current row with the new data
                    $scope.people[$scope.editRow].set($scope.model);
                } else { // otherwise
                    // stick the new person at the top of the grid (breaks our sorting, not great UX but fine for learning)
                    $scope.people.splice(0, 0, personObject);
                }
                $scope.model = {}; // clear the model
                $scope.onCancel(); // hide the edit form
            });
            $scope.showAdd = false;
        };

        // when the edit button is clicked on a given row
        $scope.onEdit = function (ix) {
            $scope.showAdd = false; // hide the add form
            $scope.editRow = ix; // set the index of the row being edited
            var currentPerson = $scope.people[ix]; // grab the current person object 
            $scope.model.fname = currentPerson.get('fname'); // update scope fname
            $scope.model.lname = currentPerson.get('lname'); // update scope lname
            $scope.model.salutation = currentPerson.get('salutation'); // BUG: this doesn't work and I don't know why, it should set the dropdown to the current salutation.
            //            $scope.salutation = {
            //                label: currentPerson.get('salutation')
            //            };
            //            $log.debug('cpsal: ' + currentPerson.get('salutation'));
            //            $log.debug('smsal: ' + $scope.model.salutation);
            $log.debug('ssal: ' + $scope.salutation);


        };

        //when the cancel button is clicked on a given row
        $scope.onCancel = function () {
            $scope.editRow = -1;
        };

        $scope.onDelete = function (ix) {
            // Standard Parse delete
            $scope.people[ix].destroy().then(function () {
                $scope.people.splice(ix, 1); // update the grid
            });
        };

    };

    // register this controller against the main module.
    angular.module('MainApp').controller('Crud', ['$scope', '$log', CrudController]);

}(this, this.angular, this.Parse)); // pass globals in explicitely to please JSLint