'use strict';

//Codes service used for communicating with the codes REST endpoints
angular.module('codes').factory('Codes', ['$resource',
  function ($resource) {
    return $resource('api/codes/:codeId', {
      codeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
