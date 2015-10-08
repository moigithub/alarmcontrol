'use strict';

var _ = require('lodash');
var Pc = require('./pc.model');

// Get list of pcs
exports.index = function(req, res) {
  Pc.find(function (err, pcs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pcs);
  });
};

// Get a single pc
exports.show = function(req, res) {
  Pc.findById(req.params.id, function (err, pc) {
    if(err) { return handleError(res, err); }
    if(!pc) { return res.status(404).send('Not Found'); }
    return res.json(pc);
  });
};

// Creates a new pc in the DB.
exports.create = function(req, res) {
  Pc.create(req.body, function(err, pc) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pc);
  });
};

// Updates an existing pc in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pc.findById(req.params.id, function (err, pc) {
    if (err) { return handleError(res, err); }
    if(!pc) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pc, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pc);
    });
  });
};

// Creates or Updates an existing pc in the DB.
exports.upserta = function(req, res) {
  
//  console.log("params",req.body);
  Pc.findOne({"pcid":req.body.pcid}, function (err, pc) {
    if (err) { return handleError(res, err); }
    //console.log("resultao find =", pc);
    

    if(!pc) {
      
      Pc.create(req.body, function(err, pc) {
        if(err) { 
      
          return handleError(res, err); }
        return res.status(201).json(pc);
      });
    } else {
      // update the existing one
      if(req.body._id) { delete req.body._id; }
      var updated = _.merge(pc, req.body);
      
      updated.save(function (err) {
        if (err) { 
//          console.log("upderr",err);
          return handleError(res, err); }
        return res.status(200).json(pc);
      });
    }
  });

};

// Deletes a pc from the DB.
exports.destroy = function(req, res) {
  Pc.findById(req.params.id, function (err, pc) {
    
    if(err) { return handleError(res, err); }
    if(!pc) { return res.status(404).send('Not Found'); }
    pc.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send("ok");
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}