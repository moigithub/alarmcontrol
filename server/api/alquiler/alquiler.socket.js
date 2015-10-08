/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Alquiler = require('./alquiler.model');

exports.register = function(socket) {
  Alquiler.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Alquiler.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('alquiler:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('alquiler:remove', doc);
}