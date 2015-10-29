'use strict';

// Codes controller
angular.module('codes').controller('CodesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Codes',
  function ($scope, $stateParams, $location, Authentication, Codes) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'codeForm');

        return false;
      }

      // Create new Article object
      var code = new Codes({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      code.$save(function (response) {
        $location.path('codes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (code) {
      if (code) {
        code.$remove();

        for (var i in $scope.codes) {
          if ($scope.codes[i] === code) {
            $scope.codes.splice(i, 1);
          }
        }
      } else {
        $scope.code.$remove(function () {
          $location.path('codes');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'codeForm');

        return false;
      }

      var code = $scope.code;

      code.$update(function () {
        $location.path('codes/' + code._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Codes
    $scope.find = function () {
      $scope.codes = Codes.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.code = Codes.get({
        codeId: $stateParams.codeId
      });
    };
  }
]);
