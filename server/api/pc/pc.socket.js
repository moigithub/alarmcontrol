/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pc = require('./pc.model');

exports.register = function(socket) {
  Pc.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pc.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pc:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pc:remove', doc);
}