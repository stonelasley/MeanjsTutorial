'use strict';

// Configuring the Articles module
angular.module('codes').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Codes',
      state: 'codes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'codes', {
      title: 'List Codes',
      state: 'codes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'codes', {
      title: 'Create Codes',
      state: 'codes.create',
      roles: ['user']
    });
  }
]);
