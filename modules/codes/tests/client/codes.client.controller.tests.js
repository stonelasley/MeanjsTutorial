'use strict';

(function () {
  // Codes Controller Spec
  describe('Codes Controller Tests', function () {
    // Initialize global variables
    var CodesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Codes,
      mockCode;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Codes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Codes = _Codes_;

      // create mock code
      mockCode = new Codes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Code about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Codes controller.
      CodesController = $controller('CodesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one code object fetched from XHR', inject(function (Codes) {
      // Create a sample codes array that includes the new code
      var sampleCodes = [mockCode];

      // Set GET response
      $httpBackend.expectGET('api/codes').respond(sampleCodes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.codes).toEqualData(sampleCodes);
    }));

    it('$scope.findOne() should create an array with one code object fetched from XHR using a codeId URL parameter', inject(function (Codes) {
      // Set the URL parameter
      $stateParams.codeId = mockCode._id;

      // Set GET response
      $httpBackend.expectGET(/api\/codes\/([0-9a-fA-F]{24})$/).respond(mockCode);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.code).toEqualData(mockCode);
    }));

    describe('$scope.create()', function () {
      var sampleCodePostData;

      beforeEach(function () {
        // Create a sample code object
        sampleCodePostData = new Codes({
          title: 'An Code about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Code about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Codes) {
        // Set POST response
        $httpBackend.expectPOST('api/codes', sampleCodePostData).respond(mockCode);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the code was created
        expect($location.path.calls.mostRecent().args[0]).toBe('codes/' + mockCode._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/codes', sampleCodePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock code in scope
        scope.code = mockCode;
      });

      it('should update a valid code', inject(function (Codes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/codes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/codes/' + mockCode._id);
      }));

      it('should set scope.error to error response message', inject(function (Codes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/codes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(code)', function () {
      beforeEach(function () {
        // Create new codes array and include the code
        scope.codes = [mockCode, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/codes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCode);
      });

      it('should send a DELETE request with a valid codeId and remove the code from the scope', inject(function (Codes) {
        expect(scope.codes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.code = mockCode;

        $httpBackend.expectDELETE(/api\/codes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to codes', function () {
        expect($location.path).toHaveBeenCalledWith('codes');
      });
    });
  });
}());
