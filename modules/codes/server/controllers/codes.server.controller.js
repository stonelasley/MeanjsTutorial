'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Code = mongoose.model('Code'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a code
 */
exports.create = function (req, res) {
  var code = new Code(req.body);
  code.user = req.user;

  code.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(code);
    }
  });
};

/**
 * Show the current code
 */
exports.read = function (req, res) {
  res.json(req.code);
};

/**
 * Update a code
 */
exports.update = function (req, res) {
  var code = req.code;

  code.title = req.body.title;
  code.content = req.body.content;

  code.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(code);
    }
  });
};

/**
 * Delete a code
 */
exports.delete = function (req, res) {
  var code = req.code;

  code.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(code);
    }
  });
};

/**
 * List of Codes
 */
exports.list = function (req, res) {
  Code.find().sort('-created').populate('user', 'displayName').exec(function (err, codes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(codes);
    }
  });
};

/**
 * Code middleware
 */
exports.codeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Code is invalid'
    });
  }

  Code.findById(id).populate('user', 'displayName').exec(function (err, code) {
    if (err) {
      return next(err);
    } else if (!code) {
      return res.status(404).send({
        message: 'No code with that identifier has been found'
      });
    }
    req.code = code;
    next();
  });
};
