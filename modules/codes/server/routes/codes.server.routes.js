'use strict';

/**
 * Module dependencies.
 */
var codesPolicy = require('../policies/codes.server.policy'),
  codes = require('../controllers/codes.server.controller');

module.exports = function (app) {
  // Codes collection routes
  app.route('/api/codes').all(codesPolicy.isAllowed)
    .get(codes.list)
    .post(codes.create);

  // Single code routes
  app.route('/api/codes/:codeId').all(codesPolicy.isAllowed)
    .get(codes.read)
    .put(codes.update)
    .delete(codes.delete);

  // Finish by binding the code middleware
  app.param('codeId', codes.codeByID);
};
