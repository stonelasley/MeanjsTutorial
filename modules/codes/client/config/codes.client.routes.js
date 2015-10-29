'use strict';

// Setting up route
angular.module('codes').config(['$stateProvider',
  function ($stateProvider) {
    // Codes state routing
    $stateProvider
      .state('codes', {
        abstract: true,
        url: '/codes',
        template: '<ui-view/>'
      })
      .state('codes.list', {
        url: '',
        templateUrl: 'modules/codes/client/views/list-codes.client.view.html'
      })
      .state('codes.create', {
        url: '/create',
        templateUrl: 'modules/codes/client/views/create-code.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('codes.view', {
        url: '/:codeId',
        templateUrl: 'modules/codes/client/views/view-code.client.view.html'
      })
      .state('codes.edit', {
        url: '/:codeId/edit',
        templateUrl: 'modules/codes/client/views/edit-code.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
