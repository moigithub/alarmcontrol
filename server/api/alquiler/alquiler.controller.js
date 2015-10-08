'use strict';

var _ = require('lodash');
var Alquiler = require('./alquiler.model');

// Get list of alquilers
exports.index = function(req, res) {
  Alquiler.find(function (err, alquilers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(alquilers);
  });
};

// Get a single alquiler
exports.show = function(req, res) {
  Alquiler.findById(req.params.id, function (err, alquiler) {
    if(err) { return handleError(res, err); }
    if(!alquiler) { return res.status(404).send('Not Found'); }
    return res.json(alquiler);
  });
};

// Creates a new alquiler in the DB.
exports.create = function(req, res) {
  Alquiler.create(req.body, function(err, alquiler) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(alquiler);
  });
};

// Updates an existing alquiler in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Alquiler.findById(req.params.id, function (err, alquiler) {
    if (err) { return handleError(res, err); }
    if(!alquiler) { return res.status(404).send('Not Found'); }
    var updated = _.extend(alquiler, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(alquiler);
    });
  });
};

// Deletes a alquiler from the DB.
exports.destroy = function(req, res) {
  Alquiler.findById(req.params.id, function (err, alquiler) {
    if(err) { return handleError(res, err); }
    if(!alquiler) { return res.status(404).send('Not Found'); }
    alquiler.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}